import { PublicKey } from '@solana/web3.js';
import { selector } from 'recoil';
import solanaClusterAtom from '../../../../_atoms/solanaClusterAtom';
import currentStateAtom from '../../../_atoms/currentStateAtom';
import addressLabel from '../../_helpers/addressLabel';
import safePubkey from '../_helpers/safePubkey';
import AddressExplorerType from '../_types/AddressExplorerType';
import tokenRegistryAtom from '../../_atoms/tokenRegistryAtom';

const addressStateAtom = selector<AddressExplorerType>({
  key: 'addressStateAtom',
  get: ({ get }) => {
    const currentState = get(currentStateAtom);

    if (currentState?.type !== 'address') {
      throw new Error('addressState unavailable');
    }

    const { type, state } = currentState;

    const pubkey = safePubkey(state);

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
