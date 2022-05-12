import { PublicKey } from '@solana/web3.js';
import { selector } from 'recoil';
import solanaClusterAtom from '../../../../_atoms/solanaClusterAtom';
import currentStateAtom from '../../../_atoms/currentStateAtom';
import addressLabel from '../_helpers/addressLabel';
import AddressExplorerType from '../_types/AddressExplorerType';
import tokenRegistryAtom from './tokenRegistryAtom';

const addressStateAtom = selector<AddressExplorerType>({
  key: 'addressStateAtom',
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

export default addressStateAtom;
