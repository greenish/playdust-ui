import React from 'react';
import { useRecoilValue } from 'recoil';
import addressStateAtom from '../_atoms/addressStateAtom';
import ExplorerLink from '../_sharedComponents/ExplorerLink/ExplorerLink';
import SuspenseBoundary from '../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import TableSkeleton from '../_sharedComponents/TableSkeleton/TableSkeleton';
import AccountDomainsRow from './AccountDomainsRow/AccountDomainsRow';
import AccountInfoRows from './AccountInfoRows';
import ExplorerCard from './ExplorerCard';
import ExplorerGrid from './ExplorerGrid';
import ExplorerGridRow from './_sharedComponents/ExplorerGridRow';

function AccountOverviewCard() {
  const addressState = useRecoilValue(addressStateAtom);

  return (
    <ExplorerCard loading={<TableSkeleton />} error={null}>
      <ExplorerGrid>
        <ExplorerGridRow
          label="Address"
          value={
            <ExplorerLink
              type="address"
              to={addressState.pubkey}
              allowCopy={true}
            />
          }
        />
        {addressState.label !== undefined && (
          <ExplorerGridRow label="Address Label" value={addressState.label} />
        )}
        <SuspenseBoundary
          content={<AccountDomainsRow />}
          error={null}
          loading={null}
        />
        <SuspenseBoundary
          content={<AccountInfoRows />}
          error={null}
          loading={null}
        />
      </ExplorerGrid>
    </ExplorerCard>
  );
}

export default AccountOverviewCard;
