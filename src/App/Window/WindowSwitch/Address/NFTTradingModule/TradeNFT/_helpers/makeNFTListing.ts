import TransactionBuffer from '../_types/TransactionBuffer';
import tradeApiInstance from './tradeApiInstance';

const makeNFTListing = async (
  wallet: string,
  mint: string,
  buyPrice: number
): Promise<TransactionBuffer> => {
  const { data } = await tradeApiInstance.post<TransactionBuffer>(`/ask`, {
    wallet,
    mint,
    buyPrice,
    tokenSize: 1,
  });

  return data;
};

export default makeNFTListing;

