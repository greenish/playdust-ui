import { Chip } from '@mui/material';
import { DateTime } from 'luxon';
import React from 'react';
import { useRecoilValue } from 'recoil';
import ExplorerAccordion from '../../_sharedComponents/ExplorerAccordion';
import ExplorerGrid from '../../_sharedComponents/ExplorerGrid';
import ExplorerGridRow from '../../_sharedComponents/ExplorerGridRow';
import ExplorerLink from '../../_sharedComponents/ExplorerLink/ExplorerLink';
import SolBalance from '../../_sharedComponents/SolBalance/SolBalance';
import rawTransactionInfoAtom from '../_atoms/rawTransactionInfoAtom';
import signatureStatusAtom from './_atoms/signatureStatusAtom';

function TransactionOverview() {
  const rawTransactionInfo = useRecoilValue(rawTransactionInfoAtom);
  const signatureStatus = useRecoilValue(signatureStatusAtom);

  if (!rawTransactionInfo) {
    return <div>No data available</div>;
  }

  const {
    blockTime,
    meta,
    slot,
    transaction: {
      message: { recentBlockhash },
      signatures,
    },
  } = rawTransactionInfo;

  const { err, fee = 0 } = meta || {};

  const result = err ? (
    <Chip color="error" label="Error" size="small" />
  ) : (
    <Chip color="success" label="Sucess" size="small" />
  );

  const localeTime = blockTime
    ? DateTime.fromMillis(blockTime * 1000).toLocaleString(
        DateTime.DATETIME_FULL
      )
    : '';

  return (
    <ExplorerAccordion
      id="transaction-overview"
      title="Transaction Overview"
      expanded={true}
      content={
        <ExplorerGrid>
          <ExplorerGridRow
            label="Signature"
            value={
              <ExplorerLink type="tx" to={signatures[0]} allowCopy={true} />
            }
          />

          <ExplorerGridRow
            label="Block"
            value={<ExplorerLink type="block" to={slot} allowCopy={true} />}
          />

          <ExplorerGridRow label="Timestamp" value={localeTime} />

          <ExplorerGridRow label="Result" value={result} />

          <ExplorerGridRow label="Fee" value={<SolBalance lamports={fee} />} />

          <ExplorerGridRow
            label="Confirmation Status"
            value={signatureStatus?.confirmationStatus ?? 'unknown'}
          />

          <ExplorerGridRow
            label="Confirmations"
            value={signatureStatus?.confirmations ?? 'max'}
          />

          <ExplorerGridRow
            label="Previous Block Hash"
            value={recentBlockhash}
          />
        </ExplorerGrid>
      }
    />
  );
}

export default TransactionOverview;
