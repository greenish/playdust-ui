import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import solanaClusterAtom from '../../../../../_atoms/solanaClusterAtom';
import addressStateAtom from '../../../_atoms/addressStateAtom';
import addressTransactionsAtom from '../_atoms/addressTransactionsAtom';
import fetchTransactionsForAddress from '../_helpers/fetchTransactionsForAddress';
import TransactionType from '../_types/TransactionType';

function useTransactionsForAddress(): [TransactionType[], () => Promise<void>] {
  const addressState = useRecoilValue(addressStateAtom);
  const cluster = useRecoilValue(solanaClusterAtom);
  const [addressTransactions, setAddressTransactions] = useRecoilState(
    addressTransactionsAtom
  );

  const fetchMoreTransactionsForAddress = useCallback(async () => {
    const lastSignature = addressTransactions.at(-1)?.signature;

    if (!addressState) {
      return;
    }

    const newTransactions = await fetchTransactionsForAddress(
      cluster,
      addressState.pubkey,
      10,
      lastSignature
    );

    setAddressTransactions((curr) => [...curr, ...newTransactions]);
  }, [addressState, cluster, addressTransactions, setAddressTransactions]);

  return [addressTransactions, fetchMoreTransactionsForAddress];
}

export default useTransactionsForAddress;
