import styled from '@emotion/styled'
import { Dispatch, SetStateAction, useState } from 'react'
import { AutoSizer, InfiniteLoader, List, Size } from 'react-virtualized'
import 'react-virtualized/styles.css'

const RootContainer = styled.div`
  height: 100%;
  width: 100%;
  display: block;
`

interface RowMeta {
  rowHeight: number
  rowCount: number
  hasMore: boolean
  cardsPerRow?: number
}

export interface VirtualizedGridChildProps extends RowMeta {
  index: number
  isLoading: boolean
}

interface VirtualizedGridProps {
  getRowMeta: (width: number, height: number, isLoading: boolean) => RowMeta
  rowRenderer: (childProps: VirtualizedGridChildProps) => React.ReactElement
  initialized: boolean
  next?: () => any
}

interface AutoSizerProps extends VirtualizedGridProps {
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

const makeAutoSizedContainer = (props: AutoSizerProps) =>
  function AutoSizedContainer({ width, height }: Size) {
    const {
      rowRenderer,
      isLoading,
      setIsLoading,
      next,
      initialized,
      getRowMeta,
    } = props

    const meta = getRowMeta(width, height, isLoading)
    const { rowHeight, rowCount, hasMore } = meta

    return (
      <div
        style={{
          height,
          width,
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
          {(infiniteLoaderProps) => (
            <List
              ref={infiniteLoaderProps.registerChild}
              onRowsRendered={infiniteLoaderProps.onRowsRendered}
              height={height}
              width={width}
              rowCount={rowCount}
              rowHeight={rowHeight}
              rowRenderer={({ key, style, index }) => (
                <div
                  key={key}
                  style={{ ...style, marginLeft: 1, width: 'calc(100% - 1px)' }}
                >
                  {rowRenderer({ index, isLoading, ...meta })}
                </div>
              )}
              props={props}
            />
          )}
        </InfiniteLoader>
      </div>
    )
  }

const VirtualizedGrid = (props: VirtualizedGridProps) => {
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

export default VirtualizedGrid
