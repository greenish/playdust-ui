import { Box, Card, Skeleton, styled, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import OpenSearchCollectionSourceType from '../../_types/OpenSearchCollectionSourceType';
import humanizeCollection from '../_helpers/humanizeCollection';
import humanizeSolana from '../_helpers/humanizeSolana';

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

interface CollectionNFTDetailsProps {
  overview: OpenSearchCollectionSourceType | null;
  skeleton?: boolean;
}

function CollectionNFTDetails(props: CollectionNFTDetailsProps) {
  if (props.skeleton) {
    return (
      <CardContainer>
        <Skeleton height={50} />
        <Skeleton height={150} />
        <ItemsContainer>
          {items.map((item) => (
            <OverviewItem
              key={item.label}
              label={item.label}
              value={<Skeleton sx={{ width: '75%' }} />}
            />
          ))}
        </ItemsContainer>
      </CardContainer>
    );
  }

  if (!props.overview) {
    return null;
  }

  return (
    <CardContainer>
      <Typography gutterBottom={true} variant="h5" component="div">
        {humanizeCollection(props.overview)}
      </Typography>
      {props.overview.description && (
        <Typography variant="body2" color="text.secondary">
          {props.overview.description}
        </Typography>
      )}
      <ItemsContainer>
        {items.map(
          (item) =>
            props.overview && (
              <OverviewItem
                key={item.label}
                label={item.label}
                value={item.getValue(props.overview)}
              />
            )
        )}
      </ItemsContainer>
    </CardContainer>
  );
}

export default CollectionNFTDetails;
