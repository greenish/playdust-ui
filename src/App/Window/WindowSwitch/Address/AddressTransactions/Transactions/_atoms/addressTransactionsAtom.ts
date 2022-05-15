import { atom, selector } from 'recoil';
import solanaClusterAtom from '../../../../../../_atoms/solanaClusterAtom';
import accountInfoAtom from '../../../_atoms/accountInfoAtom';
import fetchTransactionsForAddress from '../_helpers/fetchTransactionsForAddress';
import TransactionType from '../_types/TransactionType';

const defaultAddressTransactionsAtom = selector<TransactionType[]>({
  key: 'defaultAddressTransactionsAtom',
  get: async ({ get }) => {
    const accountInfo = get(accountInfoAtom);
    const custer = get(solanaClusterAtom);

    return fetchTransactionsForAddress(custer, accountInfo.pubkey, 10);
  },
});

const addressTransactionsAtom = atom<TransactionType[]>({
  key: 'addressTransactionsAtom',
  default: defaultAddressTransactionsAtom,
});

export default addressTransactionsAtom;
