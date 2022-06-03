import { Connection, ParsedConfirmedTransaction } from '@solana/web3.js';
import { selector } from 'recoil';
import solanaClusterAtom from '../../../../_atoms/solanaClusterAtom';
import txStateAtom from './txStateAtom';

const parsedConfirmedTransactionAtom =
  selector<ParsedConfirmedTransaction | null>({
    key: 'parsedConfirmedTransaction',
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

export default parsedConfirmedTransactionAtom;
