import TransactionBuffer from '../_types/TransactionBufferType';
import tradeApi from './tradeApi';

const makeNFTBid = async (
  wallet: string,
  mint: string,
  buyPrice: number
): Promise<TransactionBuffer> => {
  const { data } = await tradeApi.post<TransactionBuffer>(`/bid`, {
    wallet,
    mint,
    buyPrice,
    tokenSize: 1,
  });

  return data;
};

export default makeNFTBid;
