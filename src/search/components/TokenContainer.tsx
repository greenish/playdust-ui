import styled from '@emotion/styled'
import { CircularProgress } from '@mui/material'
import { Dispatch, SetStateAction, useState } from 'react'
import {
  AutoSizer,
  InfiniteLoader,
  List,
  ListRowProps,
  Size,
} from 'react-virtualized'
import 'react-virtualized/styles.css'
import { NFTSource } from '../types/OpenSearchIndex'
import TokenCard, { dimensions, TokenCardPlaceholder } from './TokenCard'

const RootContainer = styled.div`
  height: 100%;
  width: 100%;
  display: block;
`

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  margin-bottom: 24px;
  width: 100%;
`

const Loader = () => (
  <LoaderContainer>
    <CircularProgress />
  </LoaderContainer>
)

const RowRenderer = ({ key, style, index, parent }: ListRowProps) => {
  const { cardsPerRow, tokens, isLoading, total } = parent.props
  const startingIdx = cardsPerRow * index
  const tokenRange = Array.from(Array(cardsPerRow).keys())

  return (
    <div key={key} style={style}>
      <div
        style={{
          display: 'flex',
          justifyContent: cardsPerRow > 2 ? 'space-between' : 'space-evenly',
        }}
      >
        {tokenRange.map((tokenIdx) => {
          const actualIdx = startingIdx + tokenIdx
          const metadata = tokens[actualIdx]

          return actualIdx < total ? (
            <TokenCard
              key={metadata?.mint || actualIdx}
              metadata={metadata}
              loading={isLoading}
            />
          ) : (
            <TokenCardPlaceholder key={tokenIdx} />
          )
        })}
      </div>
    </div>
  )
}

interface TokenContainerProps {
  initialized: boolean
  tokens: NFTSource[]
  total: number
  next?: () => any
}

interface AutoSizerProps extends TokenContainerProps {
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

const makeAutoSizedContainer = ({
  total,
  tokens,
  next,
  isLoading,
  setIsLoading,
}: AutoSizerProps) =>
  function AutoSizedContainer(autoSizerProps: Size) {
    const cardsPerRow = Math.floor(
      autoSizerProps.width / (dimensions.width + dimensions.marginRight)
    )
    const cardRows = Math.ceil(tokens.length / cardsPerRow) || 0
    const maxRows = Math.ceil(total / cardsPerRow) || 0
    const loadingRowOffset = isLoading ? 1 : 0
    const rowCount = Math.min(cardRows + loadingRowOffset, maxRows)

    const hasMore = total > tokens.length

    return (
      <div
        style={{
          height: autoSizerProps.height,
          width: autoSizerProps.width,
        }}
      >
        <InfiniteLoader
          isRowLoaded={({ index }) => {
            if (!hasMore) {
              return true
            }

            return index + 1 < rowCount
          }}
          loadMoreRows={async () => {
            if (next && !isLoading) {
              setIsLoading(true)
              await next()
              setIsLoading(false)
            }
          }}
          rowCount={rowCount}
          threshold={2}
        >
          {(infinteLoaderProps) => (
            <List
              ref={infinteLoaderProps.registerChild}
              onRowsRendered={infinteLoaderProps.onRowsRendered}
              height={autoSizerProps.height}
              rowCount={rowCount}
              rowHeight={dimensions.height}
              rowRenderer={RowRenderer}
              width={autoSizerProps.width}
              tokens={tokens}
              cardsPerRow={cardsPerRow}
              isLoading={isLoading}
              total={total}
            />
          )}
        </InfiniteLoader>
      </div>
    )
  }

const TokenContainer = (props: TokenContainerProps) => {
  const [isLoading, setIsLoading] = useState(false)

  if (!props.initialized) {
    return <Loader />
  }

  return (
    <RootContainer>
      <AutoSizer>
        {makeAutoSizedContainer({ ...props, isLoading, setIsLoading })}
      </AutoSizer>
    </RootContainer>
  )
}

export default TokenContainer
