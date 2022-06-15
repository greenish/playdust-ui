import React, { useEffect, useRef } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { List, ListProps } from 'react-virtualized';

function VirtualizedList(props: ListProps) {
  const listRef = useRef<List>(null);
  const scrollRef = useRef<Scrollbars>(null);

  useEffect(() => {
    if (props.scrollToIndex === 0) {
      scrollRef.current?.scrollToTop();
    }

    if (props.scrollToIndex === props.rowCount - 1) {
      scrollRef.current?.scrollToBottom();
    }
  }, [props.scrollToIndex, props.rowCount]);

  return (
    <Scrollbars
      ref={scrollRef}
      onScrollFrame={({ scrollTop, scrollLeft }) => {
        listRef.current?.Grid?.handleScrollEvent({
          scrollTop,
          scrollLeft,
        });
      }}
      autoHide={true}
      style={{
        height: props.height,
        width: props.width,
      }}
    >
      <List
        ref={listRef}
        style={{
          overflowX: '-moz-hidden-unscrollable',
          overflowY: '-moz-hidden-unscrollable',
        }}
        {...props}
      />
    </Scrollbars>
  );
}

export default VirtualizedList;
