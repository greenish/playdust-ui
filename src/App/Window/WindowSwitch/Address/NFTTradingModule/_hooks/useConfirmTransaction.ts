import { useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import logger from '../../../../../_helpers/logger';
import executeNFTSale from '../_helpers/executeNFTSale';
import useTriggerNotfication from './useTriggerNotification';

const useConfirmTransaction = () => {
  const { publicKey, signTransaction } = useWallet();
  const triggerNotification = useTriggerNotfication();

  return async (
    dataPromise: Promise<{ txBuff: Buffer }>,
    success: string,
    error: string
  ) => {
    try {
      const data = await dataPromise;

      if (signTransaction && publicKey) {
        const transaction = Transaction.from(data?.txBuff);

        await signTransaction(transaction);

        const { txHash } = await executeNFTSale(data, [
          ...new Uint8Array(transaction.serialize()),
        ]);

        triggerNotification(success, 'success');

        return txHash;
      }
    } catch (e) {
      triggerNotification(error, 'error');
      logger(`transaction failed: ${error}`, e);
    }
  };
};

export default useConfirmTransaction;
