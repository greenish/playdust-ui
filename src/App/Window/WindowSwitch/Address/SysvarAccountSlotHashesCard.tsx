import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import parsedSysvarAccountAtom from './_atoms/parsedSysvarAccountAtom';
import ExplorerLink from '../_sharedComponents/ExplorerLink/ExplorerLink';
import PaginatedList from './_sharedComponents/PaginatedList';

// SysvarS1otHashes111111111111111111111111111
function SysvarAccountSlotHashesCard() {
  const parsedSysvarAccount = useRecoilValue(parsedSysvarAccountAtom);

  if (!parsedSysvarAccount || parsedSysvarAccount.type !== 'slotHashes') {
    return null;
  }

  const { info } = parsedSysvarAccount;

  return (
    <PaginatedList
      items={info}
      itemsPerPage={10}
      renderContainer={(children) => (
        <Table sx={{ paddingBottom: '24px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Slot</TableCell>
              <TableCell>Hash</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{children}</TableBody>
        </Table>
      )}
      renderItem={({ slot, hash }) => (
        <TableRow>
          <TableCell>
            <ExplorerLink type="block" to={slot} allowCopy={true} />
          </TableCell>
          <TableCell>{hash}</TableCell>
        </TableRow>
      )}
    />
  );
}

export default SysvarAccountSlotHashesCard;
