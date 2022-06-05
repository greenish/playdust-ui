import TransactionBufferType from '../../_types/TransactionBufferType';
import tradeApiInstance from '../../_helpers/tradeApiInstance';

const cancelNFTBid = async (
  wallet: string,
  mint: string,
  buyPrice: number
): Promise<TransactionBufferType> => {
  const { data } = await tradeApiInstance.post<TransactionBufferType>(
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
