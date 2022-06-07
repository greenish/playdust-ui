import styled from '@emotion/styled';
import React from 'react';
import NFTOrderBookAsks from './NFTOrderBookAsks';
import NFTOrderBookBids from './NFTOrderBookBids';

const OrderBookContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: end;
  gap: 16px;
`;

const OrderBookColumn = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: end;
`;

function NFTOrderBook() {
  return (
    <OrderBookContainer>
      <OrderBookColumn>
        <NFTOrderBookAsks />
      </OrderBookColumn>
      <OrderBookColumn>
        <NFTOrderBookBids />
      </OrderBookColumn>
    </OrderBookContainer>
  );
}

export default NFTOrderBook;
