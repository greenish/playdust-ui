import styled from '@emotion/styled'
import { Skeleton, Typography } from '@mui/material'
import { Link } from '../../../explorer/components/common/Link'
import type { TokenGroupProps } from './'
import BlurMore from './BlurMore'
import TokenCard from './TokenCard'
import VirtualizedGrid from './VirtualizedGrid'

const groupLabelHeight = 55

const RowContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: ${groupLabelHeight}px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const TokenContainer = styled.div`
  display: flex;
  overflow-y: hidden;
  overflow-x: auto;
  padding-right: 100px;
`

const skeletonRange = [...Array(20).keys()]

interface RowRendererProps {
  index: number
  parentProps: TokenGroupProps
}

const RowRenderer = (props: RowRendererProps) => {
  const { imageSize, grouped, initialized, cardGap, contentHeight } =
    props.parentProps
  const group = grouped[props.index]
  const isLoaderRow = !group
  const showActual = initialized && !isLoaderRow

  return (
    <RowContainer>
      <LabelContainer>
        {showActual ? (
          <>
            <Link href={group.groupHref}>
              <Typography variant="h4">{group.groupLabel}</Typography>
            </Link>
            {group.groupSecondary && (
              <Typography>({group.groupSecondary})</Typography>
            )}
          </>
        ) : (
          <Typography variant="h4">
            <Skeleton width={300} />
          </Typography>
        )}
      </LabelContainer>
      <TokenContainer style={{ height: imageSize, gap: cardGap }}>
        {showActual ? (
          <>
            {group.nfts.map((nft) => (
              <TokenCard
                key={nft.mint}
                metadata={nft}
                imageSize={imageSize}
                contentHeight={contentHeight}
              />
            ))}
            <BlurMore
              count={group.groupTotal - group.nfts.length}
              height={imageSize}
              href={group.groupHref}
            />
          </>
        ) : (
          <>
            {skeletonRange.map((entry) => (
              <TokenCard
                key={entry}
                skeleton
                contentHeight={contentHeight}
                imageSize={imageSize}
              />
            ))}
          </>
        )}
      </TokenContainer>
    </RowContainer>
  )
}

const TokenGroup = (props: TokenGroupProps) => {
  return (
    <VirtualizedGrid
      initialized={props.initialized}
      getRowMeta={(_width, height, isLoading) => {
        const rowHeight =
          props.imageSize +
          props.contentHeight +
          groupLabelHeight +
          props.rowGap
        const loadingRowOffset = isLoading ? 1 : 0
        const rowCount = props.initialized
          ? props.grouped.length + loadingRowOffset
          : Math.ceil(height / rowHeight)
        const hasMore = props.totalRows > rowCount

        return { rowCount, rowHeight, hasMore }
      }}
      rowRenderer={({ index }) => (
        <RowRenderer index={index} parentProps={props} />
      )}
      next={props.next}
    />
  )
}

export default TokenGroup
