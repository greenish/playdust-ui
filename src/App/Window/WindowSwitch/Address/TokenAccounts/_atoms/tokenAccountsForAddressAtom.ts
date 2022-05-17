import { selector } from 'recoil';
import solanaClusterAtom from '../../../../../_atoms/solanaClusterAtom';
import addressStateAtom from '../../_atoms/addressStateAtom';
import fetchTokenAccountsForAddress from '../_helpers/fetchTokenAccountsForAddress';
import TokenAccountsType from '../_types/TokenAccountsType';

const tokenAccountsForAddressAtom = selector<TokenAccountsType[]>({
  key: 'tokenAccountsForAddressAtom',
  get: async ({ get }) => {
    const addressState = get(addressStateAtom);
    const custer = get(solanaClusterAtom);

    const tokenAccounts = await fetchTokenAccountsForAddress(
      custer,
      addressState.pubkey
    );

    // sort by token balance desc.
    tokenAccounts.sort(
      (a, b) =>
        (b.account.data.parsed.info?.tokenAmount?.uiAmount ?? 0) -
        (a.account.data.parsed.info?.tokenAmount?.uiAmount ?? 0)
    );

    return tokenAccounts;
  },
});

export default tokenAccountsForAddressAtom;
