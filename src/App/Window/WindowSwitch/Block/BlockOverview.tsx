import { Box, Typography } from '@mui/material'
import React from 'react';
import ExplorerAccordion from '../Address/_sharedComponents/ExplorerAccordion';
import ExplorerGrid from '../Address/_sharedComponents/ExplorerGrid';
import ExplorerGridRow from '../Address/_sharedComponents/ExplorerGridRow';
import ExplorerLink from '../Address/_sharedComponents/ExplorerLink/ExplorerLink';
/* import lamportsToSol from '../../helpers/lamportsToSol'
* import toLocaleString from '../../helpers/toLocaleString'
 *  */

const BlockOverview = () => {
    const block = useRecoilValue(blockStateAtom);
    const solPrice = useRecoilValue(solPriceAtom);

    if (!block) {
        return <div>Block not found</div>
    }

    const {
        blockTime,
        blockhash,
        parentSlot,
        previousBlockhash,
        rewards,
        transactions,
    } = block;

    let leader = '';

    const rewardTotal = (rewards || []).reduce((accum: number, reward: any) => {
        if (reward.rewardType === 'Fee') {
            leader = reward.pubkey
        }
        return accum + reward.lamports
    }, 0)

    const rewardTotalInSOL = lamportsToSol(rewardTotal);
    const valueOfSOL = rewardTotalInSOL * solPrice;
    const reward = `${rewardTotalInSOL} SOL (\$${valueOfSOL}) SOL price ${solPrice}`;

    const localBlockTime = toLocaleString(blockTime);

    return (
        <ExplorerAccordion
            id="block-overview"
            title="Block Overview"
            expanded={true}
            content={
                <ExplorerGrid>
                    <ExplorerGridRow
                        label="Block"
                        value={<>
                            #{parentSlot + 1} <SlotLink to={parentSlot} label="Prev" />{' '}
                            <ExplorerLink type="slot" to={parentSlot + 2} label="Next" />
                        </>} />

                    <ExplorerGridRow
                        label="Timestamp (Local)"
                        value={localBlockTime} />

                    <ExplorerGridRow
                        label="Block Hash"
                        value={blockhash} />

                    <ExplorerGridRow
                        label="Leader"
                        value={leader} />

                    <ExplorerGridRow
                        label="Reward"
                        value={reward} />

                    <ExplorerGridRow
                        label="Transactions Total"
                        value={`${transactions.length} transactions (successful?)`} />

                    <ExplorerGridRow
                        label="Previous Block Hash"
                        value={previousBlockhash} />

                </ExplorerGrid>
            }
        />
    );
}

export default BlockOverview;
