import styled from '@emotion/styled'
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
import TokenCard, {
  dimensions,
  TokenCardPlaceholder,
  TokenCardSkeleton,
} from './TokenCard'

const RootContainer = styled.div`
  height: 100%;
  width: 100%;
  display: block;
`

const RowRenderer = ({ key, style, index, parent }: ListRowProps) => {
  const { cardsPerRow, tokens, isLoading, total, initialized } = parent.props
  const startingIdx = cardsPerRow * index
  const tokenRange = Array.from(Array(cardsPerRow).keys())

  return (
    <div
      key={key}
      style={{ ...style, marginLeft: 2, width: 'calc(100% - 2px)' }}
    >
      <div
        style={{
          display: 'flex',
          height: dimensions.height,
          justifyContent: cardsPerRow > 2 ? 'space-between' : 'space-evenly',
          alignItems: 'center',
        }}
      >
        {tokenRange.map((tokenIdx) => {
          const actualIdx = startingIdx + tokenIdx
          const metadata = tokens[actualIdx]

          if (!initialized) {
            return <TokenCardSkeleton key={actualIdx} />
          }

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
  initialized,
}: AutoSizerProps) =>
  function AutoSizedContainer(autoSizerProps: Size) {
    const cardsPerRow = Math.floor(
      autoSizerProps.width / (dimensions.width + dimensions.marginRight)
    )

    const cardRows = initialized
      ? Math.ceil(tokens.length / cardsPerRow) || 0
      : Math.ceil(autoSizerProps.height / dimensions.height)

    const maxRows = initialized ? Math.ceil(total / cardsPerRow) || 0 : cardRows

    const loadingRowOffset = isLoading ? 1 : 0

    const rowCount = initialized
      ? Math.min(cardRows + loadingRowOffset, maxRows)
      : cardRows

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
            if (!hasMore || !initialized) {
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
              initialized={initialized}
            />
          )}
        </InfiniteLoader>
      </div>
    )
  }

const TokenContainer = (props: TokenContainerProps) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <RootContainer>
      <AutoSizer>
        {makeAutoSizedContainer({
          ...props,
          isLoading,
          setIsLoading,
        })}
      </AutoSizer>
    </RootContainer>
  )
}

export default TokenContainer
