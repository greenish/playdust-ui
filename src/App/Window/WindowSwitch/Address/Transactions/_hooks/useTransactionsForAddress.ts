import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import solanaClusterAtom from '../../../../../_atoms/solanaClusterAtom';
import accountInfoAtom from '../../_atoms/accountInfoAtom';
import addressTransactionsAtom from '../_atoms/addressTransactionsAtom';
import fetchTransactionsForAddress from '../_helpers/fetchTransactionsForAddress';
import TransactionType from '../_types/TransactionType';

function useTransactionsForAddress(): [TransactionType[], () => Promise<void>] {
  const accountInfo = useRecoilValue(accountInfoAtom);
  const cluster = useRecoilValue(solanaClusterAtom);
  const [addressTransactions, setAddressTransactions] = useRecoilState(
    addressTransactionsAtom
  );

  const fetchMoreTransactionsForAddress = useCallback(async () => {
    const lastSignature = addressTransactions.at(-1)?.signature;

    const newTransactions = await fetchTransactionsForAddress(
      cluster,
      accountInfo.pubkey,
      10,
      lastSignature
    );

    setAddressTransactions((curr) => [...curr, ...newTransactions]);
  }, [accountInfo, cluster, addressTransactions, setAddressTransactions]);

  return [addressTransactions, fetchMoreTransactionsForAddress];
}

export default useTransactionsForAddress;
