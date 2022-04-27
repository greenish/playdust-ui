import { Grid, Typography } from '@mui/material'

interface ExplorerHeaderProps {
  label: string
}

export const ExplorerHeader = ({ label }: ExplorerHeaderProps) => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" gutterBottom>
          {label}
        </Typography>
      </Grid>
    </Grid>
  )
}
