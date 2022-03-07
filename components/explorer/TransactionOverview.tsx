import { Box, Chip, Grid, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import { lamportsToSol } from '../../helpers/utils'
import {
  useRawTransaction,
  useSignatureStatus,
} from '../../store/fetchTransaction'
import { ExplorerCard } from './ExplorerCard'
import { SlotLink, TxLink } from './Links'

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
        accountKeys,
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        Signature
      </Grid>
      <Grid item xs={12} md={10}>
        <TxLink to={signatures[0]} noLink allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        Block
      </Grid>
      <Grid item xs={12} md={10}>
        <SlotLink to={slot} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        Timestamp
      </Grid>
      <Grid item xs={12} md={10}>
        {localeTime}
      </Grid>
      <Grid item xs={12} md={2}>
        Result
      </Grid>
      <Grid item xs={12} md={10}>
        {result}
      </Grid>
      <Grid item xs={12} md={2}>
        Fee
      </Grid>
      <Grid item xs={12} md={10}>
        {lamportsToSol(fee)} SOL
      </Grid>
      <Grid item xs={12} md={2}>
        Confirmation Status
      </Grid>
      <Grid item xs={12} md={10}>
        {status?.confirmationStatus}
      </Grid>
      <Grid item xs={12} md={2}>
        Confirmations
      </Grid>
      <Grid item xs={12} md={10}>
        {status?.confirmations ?? 'max'}
      </Grid>
      <Grid item xs={12} md={2}>
        Previous Block Hash
      </Grid>
      <Grid item xs={12} md={2}>
        {recentBlockhash}
      </Grid>
    </Grid>
  )
}

export const TransactionOverview = (props: TransactionOverviewProps) => {
  return (
    <ExplorerCard skeleton="table">
      <Box
        sx={{
          bgcolor: 'background.paper',
        }}
        p={4}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Overview
        </Typography>
        <TransactionOverviewContent {...props} />
      </Box>
    </ExplorerCard>
  )
}
