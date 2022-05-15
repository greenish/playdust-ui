import React from 'react';
import { useRecoilValue } from 'recoil';
import accountInfoAtom from '../_atoms/accountInfoAtom';
import ExplorerLink from '../_sharedComponents/ExplorerLink/ExplorerLink';
import LabeledAddressLink from '../_sharedComponents/LabeledAddressLink/LabeledAddressLink';
import SolBalance from '../_sharedComponents/SolBalance/SolBalance';
import TableSkeleton from '../_sharedComponents/TableSkeleton/TableSkeleton';
import AccountDomainsRow from './AccountDomainsRow/AccountDomainsRow';
import ExplorerCard from './ExplorerCard';
import ExplorerGrid from './ExplorerGrid';
import ExplorerGridRow from './_sharedComponents/ExplorerGridRow';

function AccountOverviewCard() {
  const accountInfo = useRecoilValue(accountInfoAtom);

  return (
    <ExplorerCard loading={<TableSkeleton />} error={null}>
      <ExplorerGrid>
        <ExplorerGridRow
          label="Address"
          value={
            <ExplorerLink
              type="address"
              to={accountInfo.pubkey}
              allowCopy={true}
            />
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
            value={<LabeledAddressLink to={accountInfo.owner} />}
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
