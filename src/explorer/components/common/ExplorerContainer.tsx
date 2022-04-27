import { Container, Stack } from '@mui/material'
import { PropsWithChildren } from 'react'
import { ExternalLinks } from '../common/ExternalLinks'

interface ExplorerContainerProps {
  filter: string
  value: string
}

export const ExplorerContainer = ({
  filter,
  value,
  children,
}: PropsWithChildren<ExplorerContainerProps>) => {
  return (
    <Container maxWidth="lg">
      <Stack spacing={2}>
        {children}
        <ExternalLinks filter={filter} value={value} />
      </Stack>
    </Container>
  )
}
