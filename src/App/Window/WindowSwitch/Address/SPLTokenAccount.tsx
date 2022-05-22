import { BigNumber } from 'bignumber.js';
import React from 'react';
import { useRecoilValue } from 'recoil';
import parsedTokenAccountAtom from './_atoms/parsedTokenAccountAtom';
import tokenRegistryAtom from './_atoms/tokenRegistryAtom';
import ExplorerCard from './_sharedComponents/ExplorerCard';
import ExplorerGrid from './_sharedComponents/ExplorerGrid';
import ExplorerGridRow from './_sharedComponents/ExplorerGridRow';
import LabeledAddressLink from './_sharedComponents/LabeledAddressLink/LabeledAddressLink';
import TableSkeleton from './_sharedComponents/TableSkeleton/TableSkeleton';

// DNiJ7fmPKDNNMXTAmiWKDTwgHdWW6KUuTZcEyP1Pmh4j
function SPLTokenAccountRows() {
  const parsedTokenAccount = useRecoilValue(parsedTokenAccountAtom);
  const tokenRegistry = useRecoilValue(tokenRegistryAtom);

  if (!parsedTokenAccount || parsedTokenAccount.type !== 'account') {
    return null;
  }

  const { info } = parsedTokenAccount;

  let unit;
  let balance;
  if (info.isNative) {
    unit = 'SOL';
    balance = (
      <>
        ◎<pre>{new BigNumber(info.tokenAmount.uiAmountString).toFormat(9)}</pre>
      </>
    );
  } else {
    balance = info.tokenAmount.uiAmountString;
    unit = tokenRegistry.get(info.mint)?.symbol || 'tokens';
  }

  return (
    <>
      <ExplorerGridRow
        label="Mint"
        value={<LabeledAddressLink to={info.mint} allowCopy={true} />}
      />
      <ExplorerGridRow
        label="Owner"
        value={<LabeledAddressLink to={info.owner} allowCopy={true} />}
      />
      <ExplorerGridRow label={`Token balance (${unit})`} value={balance} />
      {info.state === 'uninitialized' && (
        <ExplorerGridRow label="Status" value="Uninitialized" />
      )}
      {info.rentExemptReserve && (
        <ExplorerGridRow
          label="Rent-exempt reserve (SOL)"
          value={new BigNumber(info.rentExemptReserve.uiAmountString).toFormat(
            9
          )}
        />
      )}
    </>
  );
}

function SPLTokenAccount() {
  return (
    <ExplorerCard loading={<TableSkeleton />} error={null}>
      <ExplorerGrid>
        <SPLTokenAccountRows />
      </ExplorerGrid>
    </ExplorerCard>
  );
}

export default SPLTokenAccount;
