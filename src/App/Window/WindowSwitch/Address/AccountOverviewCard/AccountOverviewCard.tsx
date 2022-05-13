import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import ExplorerCard from '../_sharedComponents/ExplorerCard/ExplorerCard';
import ExplorerGrid from '../_sharedComponents/ExplorerGrid';
import LabeledAddressLink from '../_sharedComponents/LabeledAddressLink/LabeledAddressLink';
import ExplorerGridRowType from '../_types/ExplorerGridRowType';
import SolBalance from './SolBalance/SolBalance';
import accountInfoAtom from './_atoms/accountInfoAtom';

function AccountOverviewCard() {
  const accountInfo = useRecoilValue(accountInfoAtom);

  const space = useMemo(() => {
    if (!accountInfo) {
      return undefined;
    }

    if (!('parsed' in accountInfo.data)) {
      return accountInfo.data.length;
    }

    return accountInfo.data.space;
  }, [accountInfo]);

  if (!accountInfo) {
    return null;
  }

  const rows: ExplorerGridRowType[] = [
    ['Balance (SOL)', <SolBalance lamports={accountInfo.lamports ?? 0} />],
    space !== undefined && ['Allocated Data Size', `${space} byte(s)`],
    accountInfo.owner && [
      'Assigned Program Id',
      <LabeledAddressLink pubkey={accountInfo.owner} />,
    ],
    ['Executable', accountInfo.executable ? 'Yes' : 'No'],
  ];

  return (
    <ExplorerCard skeleton="table">
      <ExplorerGrid rows={rows} />
    </ExplorerCard>
  );
}

export default AccountOverviewCard;
