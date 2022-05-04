import styled from '@emotion/styled'
import type { TokenListProps } from './TokenGrid'
import TokenCard from './_sharedComponents/TokenCard/TokenCard'
import VirtualizedGrid, {
  VirtualizedGridChildProps,
} from './_sharedComponents/VirtualizedGrid'

const RowContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
`

interface RowRendererProps {
  parentProps: TokenListProps
  gridProps: VirtualizedGridChildProps
}

const RowRenderer = ({ parentProps, gridProps }: RowRendererProps) => {
  const { tokens, initialized, total } = parentProps
  const { index, isLoading } = gridProps
  const cardsPerRow = gridProps.cardsPerRow!
  const startingIdx = cardsPerRow * index
  const tokenRange = Array.from(Array(cardsPerRow).keys())
  const justifyContent = cardsPerRow > 2 ? 'space-between' : 'space-evenly'

  return (
    <RowContainer style={{ justifyContent, marginRight: parentProps.cardGap }}>
      {tokenRange.map((tokenIdx) => {
        const actualIdx = startingIdx + tokenIdx
        const metadata = tokens[actualIdx]

        if (!initialized) {
          return (
            <TokenCard
              skeleton={true}
              key={actualIdx}
              imageSize={parentProps.imageSize}
              contentHeight={parentProps.contentHeight}
            />
          )
        }

        return actualIdx < total ? (
          <TokenCard
            key={metadata?.mint || actualIdx}
            metadata={metadata}
            loading={isLoading}
            imageSize={parentProps.imageSize}
            contentHeight={parentProps.contentHeight}
          />
        ) : (
          <div
            key={tokenIdx}
            style={{
              width: parentProps.imageSize,
              height: parentProps.imageSize,
            }}
          />
        )
      })}
    </RowContainer>
  )
}

const TokenList = (props: TokenListProps) => {
  const {
    initialized,
    tokens,
    total,
    imageSize,
    cardGap,
    contentHeight,
    rowGap,
  } = props

  return (
    <VirtualizedGrid
      initialized={initialized}
      next={props.next}
      getRowMeta={(width, height, isLoading) => {
        const cardsPerRow = Math.floor(width / (imageSize + cardGap)) || 1

        const rowHeight = imageSize + contentHeight + rowGap

        const cardRows = initialized
          ? Math.ceil(tokens.length / cardsPerRow) || 0
          : Math.ceil(height / rowHeight)

        const maxRows = initialized
          ? Math.ceil(total / cardsPerRow) || 0
          : cardRows

        const loadingRowOffset = isLoading ? 1 : 0

        const rowCount = initialized
          ? Math.min(cardRows + loadingRowOffset, maxRows)
          : cardRows

        const hasMore = total > tokens.length

        return {
          rowHeight,
          rowCount,
          hasMore,
          cardsPerRow,
        }
      }}
      rowRenderer={(gridProps) => (
        <RowRenderer gridProps={gridProps} parentProps={props} />
      )}
    />
  )
}

export default TokenList
