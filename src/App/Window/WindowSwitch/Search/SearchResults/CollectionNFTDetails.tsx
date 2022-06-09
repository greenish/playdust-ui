import {
  Box,
  Card,
  Skeleton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { ReactNode } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import OpenSearchCollectionSourceType from '../../../_types/OpenSearchCollectionSourceType';
import ExplorerAccordion from '../../Address/_sharedComponents/ExplorerAccordion';
import humanizeCollection from '../../_helpers/humanizeCollection';
import humanizeSolana from '../../_helpers/humanizeSolana';
import collectionOverviewAtom from '../_atoms/collectionOverviewAtom';

const border = '1px solid #EEEEEE';

type Item = {
  label: string;
  getValue: (data: OpenSearchCollectionSourceType) => ReactNode;
};

const items: Item[] = [
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
    getValue: ({ elementCount }) =>
      elementCount && elementCount.toLocaleString(),
  },
  {
    label: 'Listed Items',
    getValue: () => null,
  },
  {
    label: 'Listed In',
    getValue: () => null,
  },
];

interface OverviewItemProps {
  label: string;
  value: ReactNode;
}

function OverviewItem(props: OverviewItemProps) {
  return props.value ? (
    <Box
      sx={{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        ':not(:last-child)': {
          borderRight: border,
        },
      }}
    >
      <Box>{props.label}</Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {props.value}
      </Box>
    </Box>
  ) : null;
}

const CardContainer = styled(Card)({
  display: 'flex',
  backgroundColor: 'white',
  border,
  flexDirection: 'column',
  padding: 24,
  width: '100%',
});

const ItemsContainer = styled(Box)({
  marginTop: 24,
  border,
  display: 'flex',
  justifyContent: 'space-around',
});

function SimilarCollections() {
  const loadable = useRecoilValueLoadable(collectionOverviewAtom);

  if (loadable.state === 'hasValue' && loadable.contents) {
    const overview = loadable.contents;

    return (
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
                {humanizeSolana(overview.totalVolume)}
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {overview.similar.map((entry) => {
            const color = '';
            // const color =
            //   entry.totalVolume > overview.totalVolume ? warningColor : '';

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
              >
                <TableCell scope="row">
                  <Typography color={color}>
                    {humanizeCollection(entry)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color={color}>
                    {humanizeSolana(entry.totalVolume)}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }

  return null;
}

function CollectionNFTDetails() {
  const loadable = useRecoilValueLoadable(collectionOverviewAtom);

  if (loadable.state === 'loading') {
    return (
      <CardContainer>
        <Skeleton height={50} />
        <Skeleton height={150} />
      </CardContainer>
    );
  }

  if (loadable.state === 'hasValue' && loadable.contents) {
    const overview = loadable.contents;

    return (
      <Box>
        <CardContainer>
          <Typography gutterBottom={true} variant="h5" component="div">
            {humanizeCollection(overview)}
          </Typography>
          {overview.description && (
            <Typography variant="body2" color="text.secondary">
              {overview.description}
            </Typography>
          )}
          <ItemsContainer>
            {items.map(
              (item) =>
                overview && (
                  <OverviewItem
                    key={item.label}
                    label={item.label}
                    value={item.getValue(overview)}
                  />
                )
            )}
          </ItemsContainer>
        </CardContainer>

        <ExplorerAccordion
          expanded={true}
          id="similar-collections"
          title="Similar NFT Collections found"
          content={<SimilarCollections />}
        />
      </Box>
    );
  }

  return null;
}

export default CollectionNFTDetails;
