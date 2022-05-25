import { Chip } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import addressStateAtom from '../_atoms/addressStateAtom';
import parsedTokenAccountAtom from '../_atoms/parsedTokenAccountAtom';
import tokenRegistryAtom from '../_atoms/tokenRegistryAtom';
import ExplorerCard from '../_sharedComponents/ExplorerCard';
import ExplorerGrid from '../_sharedComponents/ExplorerGrid';
import ExplorerGridRow from '../_sharedComponents/ExplorerGridRow';
import LabeledAddressLink from '../_sharedComponents/LabeledAddressLink/LabeledAddressLink';
import TableSkeleton from '../_sharedComponents/TableSkeleton/TableSkeleton';
import ExternalLink from './ExternalLink';
import SPLTokenMintFungible from './SPLTokenMintFungible/SPLTokenMintFungible';

function normalizeTokenAmount(raw: string | number, decimals: number): number {
  let rawTokens: number;
  if (typeof raw === 'string') rawTokens = parseInt(raw, 10);
  else rawTokens = raw;
  return rawTokens / 10 ** decimals;
}

// Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB
function SPLTokenMintRows() {
  const addressState = useRecoilValue(addressStateAtom);
  const parsedTokenAccount = useRecoilValue(parsedTokenAccountAtom);
  const tokenRegistry = useRecoilValue(tokenRegistryAtom);

  if (!parsedTokenAccount || parsedTokenAccount.type !== 'mint') {
    return null;
  }

  const tokenInfo = tokenRegistry.get(addressState.pubkey.toBase58());

  const { info } = parsedTokenAccount;

  const { extensions = {}, tags = [] } = tokenInfo || {};

  const { website } = extensions;

  const tagChips = (
    <>
      {tags.map((tag: string) => (
        <Chip key={tag} label={tag} />
      ))}
    </>
  );

  return (
    <>
      <ExplorerGridRow
        label="Current Supply"
        value={normalizeTokenAmount(info.supply, info.decimals)}
      />
      <ExplorerGridRow label="Website" value={<ExternalLink url={website} />} />
      {info.isInitialized && (
        <ExplorerGridRow label="Status" value="Uninitialized" />
      )}
      {info.mintAuthority && (
        <ExplorerGridRow
          label="Mint Authority"
          value={
            <LabeledAddressLink to={info.mintAuthority} allowCopy={true} />
          }
        />
      )}
      {info.freezeAuthority && (
        <ExplorerGridRow
          label="Freeze Authority"
          value={
            <LabeledAddressLink to={info.freezeAuthority} allowCopy={true} />
          }
        />
      )}
      <ExplorerGridRow label="Decimals" value={info.decimals} />
      <ExplorerGridRow label="Tags" value={tagChips} />
    </>
  );
}

function SPLTokenMint() {
  return (
    <>
      <SPLTokenMintFungible />
      <ExplorerCard loading={<TableSkeleton />} error={null}>
        <ExplorerGrid>
          <SPLTokenMintRows />
        </ExplorerGrid>
      </ExplorerCard>
    </>
  );
}

export default SPLTokenMint;
