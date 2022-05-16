import { selector } from 'recoil';
import solanaClusterAtom from '../../../../../_atoms/solanaClusterAtom';
import accountInfoAtom from '../../_atoms/accountInfoAtom';
import fetchTokenAccountsForAddress from '../_helpers/fetchTokenAccountsForAddress';
import TokenAccountsType from '../_types/TokenAccountsType';

const tokenAccountsForAddressAtom = selector<TokenAccountsType[]>({
  key: 'tokenAccountsForAddressAtom',
  get: async ({ get }) => {
    const accountInfo = get(accountInfoAtom);
    const custer = get(solanaClusterAtom);

    const tokenAccounts = await fetchTokenAccountsForAddress(
      custer,
      accountInfo.pubkey
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
