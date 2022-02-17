import { Grid, Stack, Typography } from '@mui/material'
import { AddressInput } from './AddressInput'
import { CopyButton } from './CopyButton'

interface ExplorerHeaderProps {
  label: string
  filter: string
  value: string
}

export const ExplorerHeader = ({
  label,
  filter,
  value,
}: ExplorerHeaderProps) => {
  return (
    <Stack spacing={2}>
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {label}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <AddressInput />
        </Grid>
        <Grid item xs={12}>
          {value} <CopyButton value={value} />
        </Grid>
      </Grid>
    </Stack>
  )
}
