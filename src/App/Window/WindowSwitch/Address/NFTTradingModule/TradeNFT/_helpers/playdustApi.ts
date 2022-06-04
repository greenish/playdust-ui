import axios, { AxiosInstance } from 'axios';
import OrderType from '../_types/OrderType';

const instance: AxiosInstance = axios.create({
  baseURL: `/playdust-api`,
});

const TREASURY_MINT = 'So11111111111111111111111111111111111111112';

const prefix = `/auction-house/${TREASURY_MINT}`;

type TransactionBuffer = { txBuff: Buffer };
type TransactionHash = { txHash: string };

const makeNFTBid = async (
  wallet: string,
  mint: string,
  buyPrice: number
): Promise<TransactionBuffer> => {
  const { data } = await instance.post<TransactionBuffer>(`${prefix}/bid`, {
    wallet,
    mint,
    buyPrice,
    tokenSize: 1,
  });

  return data;
};

const cancelNFTBid = async (
  wallet: string,
  mint: string,
  buyPrice: number
): Promise<TransactionBuffer> => {
  const { data } = await instance.post<TransactionBuffer>(
    `${prefix}/cancel-bid`,
    {
      wallet,
      mint,
      buyPrice,
      tokenSize: 1,
    }
  );

  return data;
};

const makeNFTListing = async (
  wallet: string,
  mint: string,
  buyPrice: number
): Promise<TransactionBuffer> => {
  const { data } = await instance.post<TransactionBuffer>(`${prefix}/ask`, {
    wallet,
    mint,
    buyPrice,
    tokenSize: 1,
  });

  return data;
};

const cancelNFTListing = async (
  wallet: string,
  mint: string,
  buyPrice: number
): Promise<TransactionBuffer> => {
  const { data } = await instance.post<TransactionBuffer>(
    `${prefix}/cancel-ask`,
    {
      wallet,
      mint,
      buyPrice,
      tokenSize: 1,
    }
  );

  return data;
};

const executeNFTSale = async (
  requestData: TransactionBuffer,
  txBuff: number[]
): Promise<TransactionHash> => {
  const { data } = await instance.post<TransactionHash>(`${prefix}/execute`, {
    ...requestData,
    txBuff,
  });

  return data;
};

type AllOrders = {
  asks: OrderType<'ask'>[];
  bids: OrderType<'bid'>[];
};

const GetAllOrders = async (mint: string) => {
  const { data } = await instance.get<AllOrders>(`/trading/${mint}/orders`);
  return data;
};

const playdustApi = {
  makeNFTBid,
  cancelNFTBid,
  makeNFTListing,
  cancelNFTListing,
  executeNFTSale,
  GetAllOrders,
};

export default playdustApi;
