import { Connection, ParsedConfirmedTransaction } from '@solana/web3.js';
import { selector } from 'recoil';
import solanaClusterAtom from '../../../../../_atoms/solanaClusterAtom';
import txStateAtom from '../../_atoms/txStateAtom';

const parsedConfirmedTransactionInfoAtom =
  selector<ParsedConfirmedTransaction | null>({
    key: 'parsedConfirmedTransactionInfo',
    get: async ({ get }) => {
      const txState = get(txStateAtom);
      const solanaCluster = get(solanaClusterAtom);

      if (!txState) {
        return null;
      }

      const { state: signature } = txState;

      const connection = new Connection(solanaCluster.endpoint);

      return connection.getParsedConfirmedTransaction(signature);
    },
  });

export default parsedConfirmedTransactionInfoAtom;
