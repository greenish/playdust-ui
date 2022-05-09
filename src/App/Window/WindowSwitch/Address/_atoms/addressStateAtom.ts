import { PublicKey } from '@solana/web3.js';
import { selector } from 'recoil';
import currentStateAtom from '../../../../_atoms/currentState';
import solanaClusterAtom from '../../../../_atoms/solanaCluster';
import addressLabel from '../_helpers/addressLabel';
import AddressExplorerType from '../_types/AddressExplorerType';
import tokenRegistryAtom from './tokenRegistryAtom';

const addressState = selector<AddressExplorerType>({
  key: 'addressState',
  get: ({ get }) => {
    const currentState = get(currentStateAtom);

    if (!currentState) {
      throw new Error('Current state is required');
    }

    const { type, state } = currentState;

    if (type !== 'address') {
      throw new Error(`Invalid type ${type}`);
    }

    const pubkey = new PublicKey(state);

    const solanaCluster = get(solanaClusterAtom);
    const tokenRegistry = get(tokenRegistryAtom);

    const label = addressLabel(state, solanaCluster.network, tokenRegistry);

    return {
      type,
      state,
      pubkey,
      label,
    };
  },
});

export default addressState;
