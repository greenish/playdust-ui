import React from 'react';
/*
import { Chip, Paper, Typography } from '@mui/material'
import { ParsedMessageAccount } from '@solana/web3.js'
import { useParsedConfirmedTransaction } from '../../store/fetchTransaction'
import {
  AccountLink,
  DataCell,
  ExplorerCard,
  SolBalance,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '../common'
*/

function AccountInputs() {
  /*
    const tx = useParsedConfirmedTransaction(signature)

    if (!tx) {
      return <div>No data available</div>
    }

    const {
      meta,
      transaction: { message },
    } = tx

    const { postBalances, preBalances } = meta || {}

    if (!message.accountKeys) {
      return null
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>Pre Balance (SOL)</TableCell>
              <TableCell>Post Balance (SOL)</TableCell>
              <TableCell>Change (SOL)</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {message.accountKeys.map(
              (account: ParsedMessageAccount, idx: number) => {
                const { pubkey } = account
                let pk = ''

                try {
                  pk = pubkey.toString()
                } catch {}
                const preBalance = preBalances?.[idx] ?? 0
                const postBalance = postBalances?.[idx] ?? 0

                return (
                  <TableRow
                    key={idx}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <DataCell>
                      <AccountLink to={pk} allowCopy />
                    </DataCell>
                    <DataCell>
                      <SolBalance lamports={preBalance} />
                    </DataCell>
                    <DataCell>
                      <SolBalance lamports={postBalance} />
                    </DataCell>
                    <DataCell>
                      <SolBalance lamports={preBalance - postBalance} />
                    </DataCell>
                    <DataCell>
                      {idx === 0 && (
                        <Chip color="info" label="Fee Payer" size="small" />
                      )}
                      {account.writable && (
                        <Chip color="info" label="Writable" size="small" />
                      )}
                      {account.signer && (
                        <Chip color="info" label="Signer" size="small" />
                      )}
                      {message.instructions.find((ix) =>
                        ix.programId.equals(pubkey)
                      ) && <Chip color="info" label="Program" size="small" />}
                    </DataCell>
                  </TableRow>
                )
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    )
    */
  return <>AI</>;
}

export default AccountInputs;
