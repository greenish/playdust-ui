import React from 'react';
import { useRecoilValue } from 'recoil';
import SuspenseBoundary from '../../../../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import addressStateAtom from '../_atoms/addressStateAtom';
import ExplorerCard from '../_sharedComponents/ExplorerCard';
import ExplorerGrid from '../_sharedComponents/ExplorerGrid';
import ExplorerGridRow from '../_sharedComponents/ExplorerGridRow';
import ExplorerLink from '../_sharedComponents/ExplorerLink/ExplorerLink';
import TableSkeleton from '../_sharedComponents/TableSkeleton/TableSkeleton';
import AccountDomainsRow from './AccountDomainsRow/AccountDomainsRow';
import AccountInfoRows from './AccountInfoRows';

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
