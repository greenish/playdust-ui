import axios, { AxiosInstance } from 'axios';
import OrderType from '../_types/OrderType';

const instance: AxiosInstance = axios.create({
  baseURL: `/playdust-api`,
});

type AllOrders = {
  asks: OrderType<'ask'>[];
  bids: OrderType<'bid'>[];
};

const getOrdersForMint = async (mint: string) => {
  const { data } = await instance.get<AllOrders>(`/trading/${mint}/orders`);
  return data;
};

export default getOrdersForMint;
