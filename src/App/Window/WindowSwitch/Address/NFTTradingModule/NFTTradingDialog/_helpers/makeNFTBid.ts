import TransactionBuffer from '../_types/TransactionBufferType';
import tradeApiInstance from './tradeApiInstance';

const makeNFTBid = async (
  wallet: string,
  mint: string,
  buyPrice: number
): Promise<TransactionBuffer> => {
  const { data } = await tradeApiInstance.post<TransactionBuffer>(`/bid`, {
    wallet,
    mint,
    buyPrice,
    tokenSize: 1,
  });

  return data;
};

export default makeNFTBid;
