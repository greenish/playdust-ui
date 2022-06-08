import styled from '@emotion/styled';
import React, {
  Dispatch,
  ReactNode,
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
  WindowScroller,
  WindowScrollerChildProps,
} from 'react-virtualized';
import RowMetaProps from '../../_sharedComponents/TokenGrid/_types/RowMetaProps';
import VirtualizedGridChildProps from '../../_sharedComponents/TokenGrid/_types/VirtualizedGridChildProps';

const ContentBox = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const WindowScrollerWrapper = styled.div`
  flex: 1 1 auto;
`;

const RootContainer = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  overflow: auto;
  flex: 1 1 auto;
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
  content?: ReactNode;
}

interface AutoSizedContainerProps
  extends VirtualizedGridProps,
    WindowScrollerChildProps {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  width: number;
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
    isScrolling,
    onChildScroll,
    scrollTop,
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
            height={height || 0}
            width={width}
            rowCount={rowCount}
            rowHeight={rowHeight}
            rowRenderer={rowWrapper}
            props={props}
            autoHeight={true}
            isScrolling={isScrolling}
            onScroll={onChildScroll}
            overscanRowCount={2}
            scrollTop={scrollTop}
          />
        )}
      </InfiniteLoader>
    </div>
  );
}

function SearchWindowScroller(props: VirtualizedGridProps) {
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <RootContainer ref={setScrollElement}>
      <ContentBox>
        {props.content}
        {scrollElement && (
          <WindowScroller scrollElement={scrollElement}>
            {({
              height,
              isScrolling,
              onChildScroll,
              scrollTop,
              registerChild,
              scrollLeft,
            }) => (
              <div ref={registerChild}>
                <AutoSizer disableHeight={true}>
                  {({ width }) => (
                    <AutoSizedContainer
                      {...props}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                      width={width}
                      height={height}
                      isScrolling={isScrolling}
                      onChildScroll={onChildScroll}
                      scrollTop={scrollTop}
                      scrollLeft={scrollLeft} // remove
                      registerChild={registerChild} // remove
                    />
                  )}
                </AutoSizer>
              </div>
            )}
          </WindowScroller>
        )}
      </ContentBox>
    </RootContainer>
  );
}

export default SearchWindowScroller;
