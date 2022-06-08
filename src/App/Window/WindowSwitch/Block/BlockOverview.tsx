import { DateTime } from 'luxon';
import React from 'react';
import { useRecoilValue } from 'recoil';
import ExplorerAccordion from '../_sharedComponents/ExplorerAccordion';
import ExplorerGrid from '../_sharedComponents/ExplorerGrid';
import ExplorerGridRow from '../_sharedComponents/ExplorerGridRow';
import ExplorerLink from '../_sharedComponents/ExplorerLink/ExplorerLink';
import lamportsToSol from '../_helpers/lamportsToSol';
import blockStateAtom from './_atoms/blockStateAtom';
// import solPriceAtom from './_atoms/solPriceAtom';

function BlockOverview() {
  const block = useRecoilValue(blockStateAtom);
  const solPrice = 1; // useRecoilValue(solPriceAtom);

  if (!block) {
    return <div>Block not found</div>;
  }

  const {
    blockTime,
    blockhash,
    parentSlot,
    previousBlockhash,
    rewards,
    transactions,
  } = block;

  const epoch = '';
  let slotLeader = '';
  const parentSlotLeader = '';
  const childSlot = '';
  const childSlotLeader = '';

  const rewardTotal = (rewards || []).reduce((accum, reward) => {
    if (reward.rewardType === 'Fee') {
      slotLeader = reward.pubkey;
    }
    return accum + reward.lamports;
  }, 0);

  const rewardTotalInSOL = lamportsToSol(rewardTotal);
  const valueOfSOL = rewardTotalInSOL * solPrice;
  const reward = `${rewardTotalInSOL} SOL ($${valueOfSOL}) SOL price ${solPrice}`;

  const localBlockTime = blockTime
    ? DateTime.fromMillis(blockTime * 1000).toLocaleString(
        DateTime.DATETIME_FULL
      )
    : '';
  const utcBlockTime = blockTime
    ? DateTime.fromMillis(blockTime * 1000).toLocaleString(
        DateTime.DATETIME_FULL
      )
    : '';

  return (
    <ExplorerAccordion
      id="block-overview"
      title="Block Overview"
      expanded={true}
      content={
        <ExplorerGrid>
          <ExplorerGridRow label="Block Hash" value={<pre>{blockhash}</pre>} />

          <ExplorerGridRow label="Slot" value={parentSlot + 1} />

          <ExplorerGridRow
            label="Slot Leader"
            value={
              <ExplorerLink type="block" to={slotLeader} allowCopy={true} />
            }
          />

          <ExplorerGridRow
            label="Timestamp (Local)"
            value={<pre>{localBlockTime}</pre>}
          />

          <ExplorerGridRow
            label="Timestamp (UTC)"
            value={<pre>{localBlockTime}</pre>}
          />

          <ExplorerGridRow label="Epoch" value={<pre>{epoch}</pre>} />

          <ExplorerGridRow
            label="Parent Blockhash"
            value={<pre>{previousBlockhash}</pre>}
          />

          <ExplorerGridRow
            label="Parent Slot"
            value={<ExplorerLink type="block" to={parentSlot} />}
          />

          <ExplorerGridRow
            label="Parent Slot Leader"
            value={
              <ExplorerLink
                type="block"
                to={parentSlotLeader}
                allowCopy={true}
              />
            }
          />

          <ExplorerGridRow
            label="Child Slot"
            value={<ExplorerLink type="block" to={childSlot} />}
          />

          <ExplorerGridRow
            label="Child Slot Leader"
            value={
              <ExplorerLink
                type="block"
                to={childSlotLeader}
                allowCopy={true}
              />
            }
          />

          <ExplorerGridRow
            label="Processed Transactions"
            value={transactions.length}
          />

          <ExplorerGridRow
            label="Successful Transactions"
            value={transactions.length}
          />
        </ExplorerGrid>
      }
    />
  );
}

export default BlockOverview;
