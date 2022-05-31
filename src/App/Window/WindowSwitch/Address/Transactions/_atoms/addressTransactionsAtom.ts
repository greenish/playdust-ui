import { atom, selector } from 'recoil';
import solanaClusterAtom from '../../../../../_atoms/solanaClusterAtom';
import addressStateAtom from '../../_atoms/addressStateAtom';
import fetchTransactionsForAddress from '../_helpers/fetchTransactionsForAddress';
import TransactionType from '../_types/TransactionType';

const defaultAddressTransactionsAtom = selector<TransactionType[]>({
  key: 'defaultAddressTransactionsAtom',
  get: async ({ get }) => {
    const addressState = get(addressStateAtom);
    const custer = get(solanaClusterAtom);
    if (!addressState) {
      return [];
    }
    return fetchTransactionsForAddress(custer, addressState.pubkey, 10);
  },
});

const addressTransactionsAtom = atom<TransactionType[]>({
  key: 'addressTransactionsAtom',
  default: defaultAddressTransactionsAtom,
});

export default addressTransactionsAtom;
