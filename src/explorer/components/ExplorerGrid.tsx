import {
  Box,
  Grid,
  Table,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material'

type ExplorerGridRow = (string | JSX.Element)[] // false | [ReactNode, ReactNode]

interface ExplorerGridProps {
  rows: ExplorerGridRow[]
}

export const BasicExplorerGrid = ({ rows }: ExplorerGridProps) => {
  const content = rows.map(([label, value]) => {
    return (
      <>
        <Grid item xs={12} md={2}>
          {label}
        </Grid>
        <Grid item xs={12} md={10}>
          {value}
        </Grid>
      </>
    )
  })

  return (
    <Box
      sx={{
        backgroundColor: '#efefef',
        color: 'red',
        borderRadius: '12px',
        padding: '12px',
      }}
    >
      <Grid container spacing={2}>
        {content}
      </Grid>
    </Box>
  )
}

export const ExplorerGrid = ({ rows }: ExplorerGridProps) => {
  const content = rows.map(([label, value], idx) => {
    return (
      <TableRow
        key={idx}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell sx={{ borderBottom: '1px solid white' }}>{label}</TableCell>
        <TableCell
          sx={{
            borderBottom: '1px solid white',
            whiteSpace: 'nowrap',
            textAlign: { sm: 'left', md: 'right' },
          }}
        >
          {value}
        </TableCell>
      </TableRow>
    )
  })

  return (
    <TableContainer
      sx={{
        backgroundColor: '#efefef',
        borderRadius: '12px',
      }}
    >
      <Table>{content}</Table>
    </TableContainer>
  )
}
