type OrderType<Side> = {
  auctionHouse: string;
  wallet: string;
  txHash: string;
  qty: number;
  price: number;
  side: Side;
  market: {
    tokenSymbol: string;
  };
};

export default OrderType;
