import {
  lighten,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TypographyProps,
  useTheme,
} from '@mui/material';
import React, { ReactNode, useMemo } from 'react';
import useAddCollectionQueryNode from '../../../../_hooks/useAddCollectionQueryNode';
import OpenSearchCollectionSourceType from '../../../../_types/OpenSearchCollectionSourceType';
import humanizeCollection from '../../../_helpers/humanizeCollection';
import humanizeSolana from '../../../_helpers/humanizeSolana';
import CollectionOverviewResponseType from './_types/CollectionOverviewResponseType';

type Column = {
  label: string;
  getValue: (data: OpenSearchCollectionSourceType) => ReactNode;
};

const columns: Column[] = [
  {
    label: 'Collection',
    getValue: humanizeCollection,
  },
  {
    label: 'Total Volume',
    getValue: ({ totalVolume }) => humanizeSolana(totalVolume),
  },
  {
    label: 'Floor Price',
    getValue: ({ floorPrice }) => humanizeSolana(floorPrice),
  },
  {
    label: 'Items',
    getValue: ({ elementCount }) => elementCount.toLocaleString(),
  },
];

function SimilarCollections({
  overview,
}: {
  overview: CollectionOverviewResponseType;
}) {
  const addCollectionQueryNode = useAddCollectionQueryNode();
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

  return (
    overview && (
      <Table size="small" sx={{ backgroundColor: 'white' }}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.label}
                sx={{ color: '#45575C', fontWeight: 'bold' }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[overview, ...filtered].map((entry, index) => {
            const isOverview = !index;
            const fontProps: TypographyProps = {
              ...(entry.totalVolume > overview.totalVolume && {
                color: theme.palette.warning.main,
              }),
              ...(isOverview && {
                fontWeight: 'bold',
              }),
            };
            return (
              <TableRow
                key={entry.id}
                sx={{
                  ...(isOverview && {
                    backgroundColor: lighten(theme.palette.primary.main, 0.9),
                  }),
                }}
                hover={!isOverview}
                onClick={() => addCollectionQueryNode(entry.id, true)}
                {...(isOverview && { onClick: undefined })}
              >
                {columns.map((column) => (
                  <TableCell key={column.label} scope="row">
                    <Typography {...fontProps}>
                      {column.getValue(entry)}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    )
  );
}

export default SimilarCollections;
