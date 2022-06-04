import TransactionBuffer from '../_types/TransactionBuffer';
import tradeApiInstance from './tradeApiInstance';

const cancelNFTBid = async (
  wallet: string,
  mint: string,
  buyPrice: number
): Promise<TransactionBuffer> => {
  const { data } = await tradeApiInstance.post<TransactionBuffer>(
    `/cancel-bid`,
    {
      wallet,
      mint,
      buyPrice,
      tokenSize: 1,
    }
  );

  return data;
};

export default cancelNFTBid;
