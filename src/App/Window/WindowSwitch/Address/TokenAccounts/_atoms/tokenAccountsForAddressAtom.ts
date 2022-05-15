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

    return fetchTokenAccountsForAddress(custer, accountInfo.pubkey);
  },
});

export default tokenAccountsForAddressAtom;
