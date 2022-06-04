import TransactionBuffer from '../_types/TransactionBuffer';
import TransactionHash from '../_types/TransactionHash';
import tradeApiInstance from './tradeApiInstance';


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
