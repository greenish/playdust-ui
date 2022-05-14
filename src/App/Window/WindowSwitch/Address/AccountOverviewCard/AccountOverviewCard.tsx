import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import ExplorerCard from '../_sharedComponents/ExplorerCard/ExplorerCard';
import TableSkeleton from '../_sharedComponents/ExplorerCard/TableSkeleton/TableSkeleton';
import ExplorerGrid from '../_sharedComponents/ExplorerGrid';
import ExplorerGridRow from '../_sharedComponents/ExplorerGridRow';
import LabeledAddressLink from '../_sharedComponents/LabeledAddressLink/LabeledAddressLink';
import AccountDomainsRow from './AccountDomainsRow';
import SolBalance from './SolBalance/SolBalance';
import accountInfoAtom from './_atoms/accountInfoAtom';

function AccountOverviewCard() {
  const accountInfo = useRecoilValue(accountInfoAtom);

  return (
    <ExplorerCard fallback={<TableSkeleton />}>
      <ExplorerGrid >
        <ExplorerGridRow
          label='Address'
          value={<LabeledAddressLink pubkey={accountInfo.pubkey} allowCopy={true} />}
        />
        {accountInfo.label !== undefined &&
          <ExplorerGridRow
            label='Address Label'
            value={accountInfo.label}
          />
        }
        <AccountDomainsRow />
        <ExplorerGridRow
          label='Balance (SOL)'
          value={<SolBalance lamports={accountInfo.lamports ?? 0} />}
        />
        {accountInfo.space !== undefined &&
          <ExplorerGridRow
            label='Allocated Data Size'
            value={`${accountInfo.space} byte(s)`}
          />
        }
        {accountInfo.owner &&
          <ExplorerGridRow
            label='Assigned Program Id'
            value={<LabeledAddressLink pubkey={accountInfo.owner} />}
          />
        }
        <ExplorerGridRow
          label='Executable'
          value={accountInfo.executable ? 'Yes' : 'No'}
        />
      </ExplorerGrid>
    </ExplorerCard>
  );
}

export default AccountOverviewCard;
