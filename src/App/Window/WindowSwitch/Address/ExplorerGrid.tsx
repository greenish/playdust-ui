import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import React from 'react';

type ExplorerGridRow = (string | JSX.Element)[] | '' | undefined;

interface ExplorerGridProps {
  rows: ExplorerGridRow[];
}

function ExplorerGrid({ rows }: ExplorerGridProps) {
  const content = rows.map((row, idx) => {
    if (!row) {
      return;
    }

    const [label, value] = row;

    /* eslint-disable react/no-array-index-key */
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
    );
  });

  return (
    <Box
      sx={{
        backgroundColor: '#efefef',
        borderRadius: '12px',
      }}
    >
      <TableContainer>
        <Table>
          <TableBody>{content}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ExplorerGrid;
