import TransactionBuffer from '../_types/TransactionBufferType';
import TransactionHash from '../_types/TransactionHashType';
import tradeApiInstance from './tradeApi';

const executeNFTSale = async (
  requestData: TransactionBuffer,
  txBuff: number[]
): Promise<TransactionHash> => {
  const { data } = await tradeApiInstance.post<TransactionHash>(`/execute`, {
    ...requestData,
    txBuff,
  });

  return data;
};

export default executeNFTSale;
