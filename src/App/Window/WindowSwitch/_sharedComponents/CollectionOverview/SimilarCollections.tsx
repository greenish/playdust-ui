import {
  Box,
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
import humanizeCollection from '../../../_helpers/humanizeCollection';
import useAddCollectionQueryNode from '../../../_hooks/useAddCollectionQueryNode';
import humanizeSolana from '../../_helpers/humanizeSolana';
import CollectionOverviewResponseType from './_types/CollectionOverviewResponseType';

type Column = {
  label: string;
  getValue: (data: CollectionOverviewResponseType) => ReactNode;
};

const columns: Column[] = [
  {
    label: 'Collection',
    getValue: humanizeCollection,
  },
  {
    label: 'Total Volume',
    getValue: ({ volume }) => humanizeSolana(volume.global.total),
  },
  {
    label: 'Floor Price',
    getValue: ({ floorPrice }) => humanizeSolana(floorPrice.global),
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
  const theme = useTheme();
  const addCollectionQueryNode = useAddCollectionQueryNode();
  const filtered = useMemo(() => {
    if (!overview) {
      return [];
    }

    return overview.similar.filter((entry) => {
      const noName = !entry.name || entry.name === '';
      const noSymbol = !entry.symbol || entry.symbol === '';

      return !(noName && noSymbol);
    });
    // .slice(0, 5);
  }, [overview]);

  const overviewColor = useMemo(() => {
    const { similar, ...current } = overview;

    if (!current.volume.global.total) {
      return theme.palette.error;
    }

    const highestVolume = Math.max(
      ...[
        current.volume.global.total,
        ...similar.map((s) => s.volume.global.total),
      ]
    );

    if (current.volume.global.total === highestVolume) {
      return theme.palette.success;
    }

    return theme.palette.warning;
  }, [overview, theme]);

  return (
    overview && (
      <Box
        sx={{ display: 'flex', flexDirection: 'column', maxHeight: '350px' }}
      >
        <Typography sx={{ p: '8px 16px', backgroundColor: '#F6F6F6' }}>
          Similar NFT Collections found
        </Typography>
        <Box sx={{ width: '100%', overflow: 'auto' }}>
          <Table
            size="small"
            sx={{
              backgroundColor: 'white',
              overflow: 'auto',
            }}
          >
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.label}
                    sx={{
                      color: '#45575C',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      whiteSpace: 'nowrap',
                    }}
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
                  fontSize: '0.8rem',
                  ...(isOverview && {
                    fontWeight: 'bold',
                    color: overviewColor.main,
                  }),
                };
                return (
                  <TableRow
                    key={entry.id}
                    sx={{
                      ...(isOverview && {
                        backgroundColor: lighten(overviewColor.main, 0.9),
                      }),
                    }}
                    hover={!isOverview}
                    onClick={() => addCollectionQueryNode(entry.id, true)}
                    {...(isOverview && { onClick: undefined })}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.label}
                        scope="row"
                        sx={{ whiteSpace: 'nowrap' }}
                      >
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
        </Box>
      </Box>
    )
  );
}

export default SimilarCollections;
