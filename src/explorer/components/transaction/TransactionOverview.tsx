import { Chip, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import compact from '../../helpers/compact'
import { useRawTransaction, useSignatureStatus } from '../../store'
import {
  ExplorerCard,
  ExplorerGrid,
  SlotLink,
  SolBalance,
  TxLink,
} from '../common'

interface TransactionOverviewProps {
  signature: string
}

export const TransactionOverviewContent = ({
  signature,
}: TransactionOverviewProps) => {
  const tx = useRawTransaction(signature)
  const status = useSignatureStatus(signature)

  if (!tx) {
    return <div>No data available</div>
  }

  const {
    blockTime,
    meta,
    slot,
    transaction: {
      message: {
        header: {
          numReadonlySignedAccounts,
          numReadonlyUnsignedAccounts,
          numRequiredSignatures,
        },
        recentBlockhash,
      },
      signatures,
    },
  } = tx

  const { err, fee = 0 } = meta || {}

  const result = err ? (
    <Chip color="error" label="Error" />
  ) : (
    <Chip color="success" label="Sucess" />
  )

  const localeTime = blockTime
    ? DateTime.fromMillis(blockTime * 1000).toLocaleString(
        DateTime.DATETIME_FULL
      )
    : ''

  const rows = compact([
    ['Signature', <TxLink to={signatures[0]} allowCopy />],
    ['Block', <SlotLink to={slot} allowCopy />],
    ['Timestamp', localeTime],
    ['Result', result],
    ['Fee', <SolBalance lamports={fee} />],
    ['Confirmation Status', status?.confirmationStatus],
    ['Confirmations', status?.confirmations ?? 'max'],
    ['Previous Block Hash', recentBlockhash],
  ])

  return <ExplorerGrid rows={rows} />
}

export const TransactionOverview = (props: TransactionOverviewProps) => {
  return (
    <ExplorerCard skeleton="table">
      <Typography variant="h5" component="h2" gutterBottom>
        Overview
      </Typography>
      <TransactionOverviewContent {...props} />
    </ExplorerCard>
  )
}
