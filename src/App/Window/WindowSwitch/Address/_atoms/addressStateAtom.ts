import { PublicKey } from '@solana/web3.js';
import { selector } from 'recoil';
import solanaClusterAtom from '../../../../_atoms/solanaClusterAtom';
import currentStateAtom from '../../../_atoms/currentStateAtom';
import addressLabel from '../_helpers/addressLabel';
import AddressExplorerType from '../_types/AddressExplorerType';
import tokenRegistryAtom from './tokenRegistryAtom';

const addressStateAtom = selector<AddressExplorerType | null>({
  key: 'addressStateAtom',
  get: ({ get }) => {
    const currentState = get(currentStateAtom);

    if (!currentState) {
      return null;
    }

    const { type, state } = currentState;

    if (type !== 'address') {
      return null;
    }

    const pubkey = new PublicKey(state);

    const solanaCluster = get(solanaClusterAtom);
    const tokenRegistry = get(tokenRegistryAtom);

    const label = addressLabel(state, solanaCluster.network, tokenRegistry);
    const hasPrivateKey = PublicKey.isOnCurve(pubkey.toBytes());

    return {
      type,
      state,
      pubkey,
      label,
      hasPrivateKey,
    };
  },
});

export default addressStateAtom;
