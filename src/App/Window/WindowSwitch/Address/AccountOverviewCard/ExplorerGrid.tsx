import { Box, Table, TableBody, TableContainer } from '@mui/material';
import React, { PropsWithChildren } from 'react';

function ExplorerGrid({ children }: PropsWithChildren<null>) {
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
