import React from 'react';
import { useRecoilValue } from 'recoil';
import parsedConfigAccountAtom from './_atoms/parsedConfigAccountAtom';
import ExplorerCard from './_sharedComponents/ExplorerCard';
import ExplorerGrid from './_sharedComponents/ExplorerGrid';
import ExplorerGridRow from './_sharedComponents/ExplorerGridRow';
import TableSkeleton from './_sharedComponents/TableSkeleton/TableSkeleton';

const MAX_SLASH_PENALTY = 2 ** 8;

function StakeConfigAccountCardRows() {
  const parsedConfigAccount = useRecoilValue(parsedConfigAccountAtom);

  if (!parsedConfigAccount || parsedConfigAccount.type !== 'stakeConfig') {
    return null;
  }

  const { info } = parsedConfigAccount;

  const warmupCooldownFormatted = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(info.warmupCooldownRate);

  const slashPenaltyFormatted = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(info.slashPenalty / MAX_SLASH_PENALTY);

  return (
    <>
      <ExplorerGridRow
        label="Warmup / Cooldown Rate"
        value={warmupCooldownFormatted}
      />
      <ExplorerGridRow label="Slash Penalty" value={slashPenaltyFormatted} />
    </>
  );
}

function StakeConfigAccountCard() {
  return (
    <ExplorerCard loading={<TableSkeleton />} error={null}>
      <ExplorerGrid>
        <StakeConfigAccountCardRows />
      </ExplorerGrid>
    </ExplorerCard>
  );
}

export default StakeConfigAccountCard;
