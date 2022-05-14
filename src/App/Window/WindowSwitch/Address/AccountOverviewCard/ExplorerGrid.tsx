import { Box, Table, TableBody, TableContainer } from '@mui/material';
import React, { ReactNode } from 'react';

function ExplorerGrid({ children }: { children: ReactNode | undefined }) {
  return (
    <Box>
      <TableContainer>
        <Table>
          <TableBody>{children}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ExplorerGrid;
