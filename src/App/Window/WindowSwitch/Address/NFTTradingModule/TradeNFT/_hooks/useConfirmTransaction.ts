import { useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import executeNFTSale from '../_helpers/executeNFTSale';
import useTriggerNotfication from './useTriggerNotification';

const useConfirmTransaction = () => {
  const { publicKey, signTransaction } = useWallet();
  const triggerNotificaiton = useTriggerNotfication();

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

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { txHash } = await executeNFTSale(data, [
          ...new Uint8Array(transaction.serialize()),
        ]);

        triggerNotificaiton(success, 'success');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return txHash;
      }
    } catch (e) {
      triggerNotificaiton(error, 'error');
      console.error('transaction failed:', e);
    }
  };
};

export default useConfirmTransaction;
