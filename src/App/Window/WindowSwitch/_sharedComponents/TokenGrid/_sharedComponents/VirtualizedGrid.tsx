import styled from '@emotion/styled';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  AutoSizer,
  InfiniteLoader,
  List,
  ListRowRenderer,
} from 'react-virtualized';
import 'react-virtualized/styles.css';
import type RowMetaProps from '../_types/RowMetaProps';
import type VirtualizedGridChildProps from '../_types/VirtualizedGridChildProps';

const RootContainer = styled.div`
  height: 100%;
  width: 100%;
  display: block;
`;

interface VirtualizedGridProps {
  getRowMeta: (
    width: number,
    height: number,
    isLoading: boolean
  ) => RowMetaProps;
  rowRenderer: (childProps: VirtualizedGridChildProps) => React.ReactElement;
  initialized: boolean;
  next?: () => Promise<void>;
}

interface AutoSizedContainerProps extends VirtualizedGridProps {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  width: number;
  height: number;
}

function AutoSizedContainer(props: AutoSizedContainerProps) {
  const {
    rowRenderer,
    isLoading,
    setIsLoading,
    next,
    initialized,
    getRowMeta,
    width,
    height,
  } = props;

  const meta = useMemo(
    () => getRowMeta(width, height, isLoading),
    [getRowMeta, width, height, isLoading]
  );
  const { rowHeight, rowCount, hasMore } = meta;

  const rowWrapper = useCallback<ListRowRenderer>(
    ({ key, style, index }) => (
      <div
        key={key}
        style={{ ...style, marginLeft: 1, width: 'calc(100% - 1px)' }}
      >
        {rowRenderer({ index, isLoading, ...meta })}
      </div>
    ),
    [rowRenderer, isLoading, meta]
  );

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
            return true;
          }
          return index + 1 < rowCount;
        }}
        loadMoreRows={async () => {
          if (next && !isLoading) {
            setIsLoading(true);
            await next();
            setIsLoading(false);
          }
          return Promise.resolve();
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
            rowRenderer={rowWrapper}
            props={props}
          />
        )}
      </InfiniteLoader>
    </div>
  );
}

function VirtualizedGrid(props: VirtualizedGridProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <RootContainer>
      <AutoSizer>
        {(autoSizerProps) => (
          <AutoSizedContainer
            {...props}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            width={autoSizerProps.width}
            height={autoSizerProps.height}
          />
        )}
      </AutoSizer>
    </RootContainer>
  );
}

export default VirtualizedGrid;
