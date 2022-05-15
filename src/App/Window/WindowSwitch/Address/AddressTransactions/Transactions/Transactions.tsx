import SuccessIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { DateTime } from 'luxon';
import React from 'react';
import safePromise from '../../../../../_helpers/safePromise';
import SolBalance from '../../_sharedComponents/SolBalance/SolBalance';
import ExplorerLink from '../../_sharedComponents/ExplorerLink/ExplorerLink';
import useTransactionsForAddress from './_hooks/useTransactionsForAddress';
import TransactionType from './_types/TransactionType';

function toRelative(time: number | undefined | null): string | null {
  return !time ? null : DateTime.fromMillis(time * 1000).toRelative();
}

function TransactionRow({ transaction }: { transaction: TransactionType }) {
  const err = transaction.parsedTransaction?.meta?.err !== null;
  const time = toRelative(transaction.signatureInfo.blockTime);
  const fee = transaction.parsedTransaction?.meta?.fee;
  const sender =
    transaction.parsedTransaction?.transaction.message.accountKeys[0]?.pubkey;

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row">
        {err ? (
          <ErrorIcon color="error" fontSize="small" />
        ) : (
          <SuccessIcon color="success" fontSize="small" />
        )}
      </TableCell>
      <TableCell>
        <ExplorerLink type="tx" to={transaction.signature} allowCopy={true} />
      </TableCell>
      <TableCell>
        <ExplorerLink
          type="block"
          to={transaction.signatureInfo.slot}
          allowCopy={true}
        />
      </TableCell>
      <TableCell>{time}</TableCell>
      <TableCell>{sender?.toString()}</TableCell>
      <TableCell>
        <SolBalance lamports={fee} />
      </TableCell>
    </TableRow>
  );
}

function Transactions() {
  const [transactions, fetchMoreTransactions] = useTransactionsForAddress();

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Signature</TableCell>
              <TableCell>Block</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>By</TableCell>
              <TableCell>Fee (SOL)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TransactionRow
                transaction={transaction}
                key={transaction.signature}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={() => safePromise(fetchMoreTransactions())}>
        Load More
      </Button>
    </>
  );
}

export default Transactions;
