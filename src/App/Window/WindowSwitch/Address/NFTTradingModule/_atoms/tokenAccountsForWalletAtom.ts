import { selector } from 'recoil';
import connectedWalletAtom from '../../../../../_atoms/connectedWalletAtom';
import solanaClusterAtom from '../../../../../_atoms/solanaClusterAtom';
import fetchTokenAccountsForAddress from '../../_helpers/fetchTokenAccountsForAddress';
import safePubkey from '../../_helpers/safePubkey';
import TokenAccountsType from '../../_types/TokenAccountsType';

const tokenAccountsForWalletAtom = selector<TokenAccountsType[]>({
  key: 'tokenAccountsForWalletAtom',
  get: async ({ get }) => {
    const walletPubkey = get(connectedWalletAtom);
    const cluster = get(solanaClusterAtom);

    if (!walletPubkey) {
      return [];
    }

    const tokenAccounts = await fetchTokenAccountsForAddress(
      cluster,
      safePubkey(walletPubkey)
    );

    // sort by token balance desc.
    tokenAccounts.sort(
      (a, b) =>
        b.data.info.tokenAmount.uiAmount - a.data.info.tokenAmount.uiAmount
    );

    return tokenAccounts;
  },
});

export default tokenAccountsForWalletAtom;
