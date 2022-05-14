import {
  Box,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import React from 'react';

const ExplorerGrid: React.FC<{}> = ({ children }) => {
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
