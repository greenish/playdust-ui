import styled from '@emotion/styled'
import { CircularProgress } from '@mui/material'
import {
  AutoSizer,
  InfiniteLoader,
  List,
  ListRowProps,
  Size,
} from 'react-virtualized'
import 'react-virtualized/styles.css'
import { ParsedMetadata } from '../../solana/types'
import TokenCard, { dimensions, TokenCardContainer } from './TokenCard'

const RootContainer = styled.div`
  height: 100%;
  width: 100%;
  display: block;
`

const TokensContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
  const { cardsPerRow, data } = parent.props
  const startingIdx = cardsPerRow * index
  const tokenRange = Array.from(Array(cardsPerRow).keys())

  return (
    <div key={key} style={style}>
      <TokensContainer>
        {tokenRange.map((tokenIdx) => {
          const token = data[tokenIdx + startingIdx]

          return token ? (
            <TokenCard key={token.mint} metadata={token} />
          ) : (
            <TokenCardContainer key={`empty-${tokenIdx}`} />
          )
        })}
      </TokensContainer>
    </div>
  )
}

interface TokenContainerProps {
  initialized: boolean
  tokens: ParsedMetadata[]
  hasMore: boolean
  next?: () => any
}

const makeAutoSizedContainer = ({
  tokens,
  hasMore,
  next,
}: TokenContainerProps) =>
  function AutoSizedContainer(autoSizerProps: Size) {
    const cardsPerRow = Math.floor(autoSizerProps.width / dimensions.width)
    const rowCount = hasMore
      ? Math.floor(tokens.length / cardsPerRow)
      : Math.ceil(tokens.length / cardsPerRow)

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
            next && next()
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
              data={tokens}
              cardsPerRow={cardsPerRow}
            />
          )}
        </InfiniteLoader>
      </div>
    )
  }

const TokenContainer = (props: TokenContainerProps) => {
  if (!props.initialized) {
    return <Loader />
  }

  return (
    <RootContainer>
      <AutoSizer>{makeAutoSizedContainer(props)}</AutoSizer>
    </RootContainer>
  )
}

export default TokenContainer
