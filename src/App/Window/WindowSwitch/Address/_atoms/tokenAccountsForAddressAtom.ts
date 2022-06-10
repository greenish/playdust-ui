import { selector } from 'recoil';
import solanaClusterAtom from '../../../../_atoms/solanaClusterAtom';
import addressStateAtom from '../../_atoms/addressStateAtom';
import fetchTokenAccountsForAddress from '../_helpers/fetchTokenAccountsForAddress';
import TokenAccountsType from '../_types/TokenAccountsType';

const tokenAccountsForAddressAtom = selector<TokenAccountsType[]>({
  key: 'tokenAccountsForAddressAtom',
  get: async ({ get }) => {
    const addressState = get(addressStateAtom);
    const cluster = get(solanaClusterAtom);

    if (!addressState) {
      return [];
    }

    const tokenAccounts = await fetchTokenAccountsForAddress(
      cluster,
      addressState.pubkey
    );

    // sort by token balance desc.
    tokenAccounts.sort(
      (a, b) =>
        b.data.info.tokenAmount.uiAmount - a.data.info.tokenAmount.uiAmount
    );

    return tokenAccounts;
  },
});

export default tokenAccountsForAddressAtom;
