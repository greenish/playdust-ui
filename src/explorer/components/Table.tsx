import {
  Table as MUITable,
  TableBody as MUITableBody,
  TableCell as MUITableCell,
  TableCellProps as MUITableCellProps,
  TableContainer as MUITableContainer,
  TableHead as MUITableHeader,
  TableRow as MUITableRow,
} from '@mui/material'

export const Table = MUITable
export const TableBody = MUITableBody
export const TableCell = MUITableCell
export const TableContainer = MUITableContainer
export const TableHead = MUITableHeader
export const TableRow = MUITableRow

export const DataCell = ({ children, ...props }: MUITableCellProps) => {
  return (
    <MUITableCell
      {...props}
      sx={{
        whiteSpace: 'nowrap',
        textAlign: 'left',
      }}
    >
      {children}
    </MUITableCell>
  )
}
