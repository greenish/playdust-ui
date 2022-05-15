import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import tokenRegistryAtom from '../_atoms/tokenRegistryAtom';
import ExplorerAccordion from '../_sharedComponents/ExplorerAccordion';
import ExplorerLink from '../_sharedComponents/ExplorerLink/ExplorerLink';
import LabeledAddressLink from '../_sharedComponents/LabeledAddressLink/LabeledAddressLink';
import tokenAccountsForAddressAtom from './_atoms/tokenAccountsForAddressAtom';
import TokenAccountsType from './_types/TokenAccountsType';

function RenderTokenAccount({
  tokenAccount,
}: {
  tokenAccount: TokenAccountsType;
}) {
  const tokenRegistry = useRecoilValue(tokenRegistryAtom);
  const mintAddress = tokenAccount.account.data.parsed.info?.mint;
  const balance =
    tokenAccount.account.data.parsed.info?.tokenAmount?.uiAmountString;
  const tokenInfo = tokenRegistry.get(mintAddress ?? '');
  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row">
        {tokenInfo?.logoURI && (
          <img
            src={tokenInfo?.logoURI}
            height={32}
            style={{
              margin: '-8px 0',
            }}
            alt={`Token (${String(tokenInfo?.symbol ?? '')}) logo`}
          />
        )}
      </TableCell>
      <TableCell>
        <ExplorerLink
          type="address"
          to={tokenAccount.pubkey}
          ellipsis={{
            remain: 4,
            cutoff: 4,
          }}
        />
      </TableCell>
      <TableCell>
        {mintAddress && (
          <LabeledAddressLink
            to={mintAddress}
            ellipsis={{
              remain: 4,
              cutoff: 4,
            }}
          />
        )}
      </TableCell>
      <TableCell>
        {`${String(balance)} ${String(tokenInfo?.symbol ?? '')}`}
      </TableCell>
    </TableRow>
  );
}

function RenderTokenAccounts() {
  const tokenAccounts = useRecoilValue(tokenAccountsForAddressAtom);
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Logo</TableCell>
          <TableCell>Account Address</TableCell>
          <TableCell>Mint Address</TableCell>
          <TableCell>Balance</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tokenAccounts.map((tokenAccount) => (
          <RenderTokenAccount
            tokenAccount={tokenAccount}
            key={String(tokenAccount.pubkey)}
          />
        ))}
      </TableBody>
    </Table>
  );
}

function TokenAccounts() {
  return (
    <ExplorerAccordion
      id="tokens"
      title="Tokens"
      content={<RenderTokenAccounts />}
    />
  );
}

export default TokenAccounts;
