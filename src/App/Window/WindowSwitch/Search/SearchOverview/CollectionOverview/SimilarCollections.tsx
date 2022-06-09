import {
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import humanizeCollection from '../../../../_helpers/humanizeCollection';
import humanizeSolana from '../../../_helpers/humanizeSolana';
import collectionOverviewAtom from './_atoms/collectionOverviewAtom';

interface SimilarCollectionsProps {
  open: boolean;
  onClick: (selectedId: string) => void;
  onClose: () => void;
}

function SimilarCollections({
  open,
  onClose,
  onClick,
}: SimilarCollectionsProps) {
  const overview = useRecoilValue(collectionOverviewAtom);
  const theme = useTheme();
  const filtered = useMemo(() => {
    if (!overview) {
      return [];
    }

    return overview.similar.filter((entry) => {
      const noName = !entry.name || entry.name === '';
      const noSymbol = !entry.symbol || entry.symbol === '';

      return !(noName && noSymbol);
    });
  }, [overview]);

  if (!overview) {
    return null;
  }

  const warningColor = theme.palette.warning.main;

  return (
    <Dialog onClose={onClose} open={open} fullWidth={true}>
      <DialogTitle>Similar Collections</DialogTitle>
      <DialogContent>
        <Table stickyHeader={true}>
          <TableHead>
            <TableRow>
              <TableCell>Collection</TableCell>
              <TableCell align="right">Volume (SOL)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row">
                <Typography fontWeight="bold">
                  {humanizeCollection(overview)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight="bold">
                  {humanizeSolana(overview.volume.global.total)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((entry) => {
              const color =
                entry.volume.global.total > overview.volume.global.total
                  ? warningColor
                  : '';

              return (
                <TableRow
                  key={entry.id}
                  sx={{
                    '&:last-child td, &:last-child th': {
                      border: 0,
                    },
                    cursor: 'pointer',
                  }}
                  hover={true}
                  onClick={() => onClick(entry.id)}
                >
                  <TableCell scope="row">
                    <Typography color={color}>
                      {humanizeCollection(entry)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color={color}>
                      {humanizeSolana(entry.volume.global.total)}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

export default SimilarCollections;