import { Connection, Transaction } from '@solana/web3.js';
import { selector } from 'recoil';
import solanaClusterAtom from '../../../../_atoms/solanaClusterAtom';
import TransactionInfoType from '../_types/TransactionInfoType';
import txStateAtom from './txStateAtom';

const transactionInfoAtom = selector<TransactionInfoType | null>({
  key: 'transactionInfo',
  get: async ({ get }) => {
    const txState = get(txStateAtom);
    const solanaCluster = get(solanaClusterAtom);

    if (!txState) {
      return null;
    }

    const { state: signature } = txState;

    const connection = new Connection(solanaCluster.endpoint);
    const response = await connection.getTransaction(signature);

    if (!response) {
      return null;
    }

    const {
      transaction: { message, signatures },
    } = response;

    return {
      message,
      signatures,
      transaction: Transaction.populate(message, signatures),
    };
  },
});

export default transactionInfoAtom;
