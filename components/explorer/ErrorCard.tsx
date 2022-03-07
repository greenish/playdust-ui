import { Box, Typography } from '@mui/material'
import { PropsWithChildren } from 'react'

interface ErrorCardProps {
  title?: string
  message?: string
}

export const ErrorCard = ({
  title,
  message,
  children,
}: PropsWithChildren<ErrorCardProps>) => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
      }}
    >
      {title && (
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
      )}
      {message || 'An error occurred'}
    </Box>
  )
}
