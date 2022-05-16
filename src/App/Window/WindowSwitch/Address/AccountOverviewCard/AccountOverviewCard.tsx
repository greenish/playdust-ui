import React from 'react';
import { useRecoilValue } from 'recoil';
import AccountDomainsRow from './AccountDomainsRow/AccountDomainsRow';
import ExplorerCard from './ExplorerCard';
import ExplorerGrid from './ExplorerGrid';
import LabeledAddressLink from './LabeledAddressLink/LabeledAddressLink';
import SolBalance from './SolBalance/SolBalance';
import TableSkeleton from './TableSkeleton/TableSkeleton';
import accountInfoAtom from './_atoms/accountInfoAtom';
import ExplorerGridRow from './_sharedComponents/ExplorerGridRow';

function AccountOverviewCard() {
  const accountInfo = useRecoilValue(accountInfoAtom);

  return (
    <ExplorerCard loading={<TableSkeleton />} error={null}>
      <ExplorerGrid>
        <ExplorerGridRow
          label="Address"
          value={
            <LabeledAddressLink pubkey={accountInfo.pubkey} allowCopy={true} />
          }
        />
        {accountInfo.label !== undefined && (
          <ExplorerGridRow label="Address Label" value={accountInfo.label} />
        )}
        <AccountDomainsRow />
        <ExplorerGridRow
          label="Balance (SOL)"
          value={<SolBalance lamports={accountInfo.lamports ?? 0} />}
        />
        {accountInfo.space !== undefined && (
          <ExplorerGridRow
            label="Allocated Data Size"
            value={`${accountInfo.space} byte(s)`}
          />
        )}
        {accountInfo.owner && (
          <ExplorerGridRow
            label="Assigned Program Id"
            value={<LabeledAddressLink pubkey={accountInfo.owner} />}
          />
        )}
        <ExplorerGridRow
          label="Executable"
          value={accountInfo.executable ? 'Yes' : 'No'}
        />
      </ExplorerGrid>
    </ExplorerCard>
  );
}

export default AccountOverviewCard;
