import { TableCell, TableRow } from '@mui/material';
import React from 'react';

type ExplorerGridRowProps = {
  label: string | JSX.Element;
  value: string | JSX.Element;
  key?: string;
};

function ExplorerGridRow({ label, value, key }: ExplorerGridRowProps) {
  return (
    <TableRow key={key}>
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
}

export default ExplorerGridRow;
