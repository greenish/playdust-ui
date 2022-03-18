import { Container, Stack } from '@mui/material'
import { PropsWithChildren } from 'react'

type ExplorerContainerProps = PropsWithChildren<{}>

export const ExplorerContainer = ({ children }: ExplorerContainerProps) => {
  return (
    <Container maxWidth="lg">
      <Stack spacing={2}>{children}</Stack>
    </Container>
  )
}
