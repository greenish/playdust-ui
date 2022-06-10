import { Box, ButtonBase, Card, Grid, styled, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import { useRecoilValue } from 'recoil';
import ImageButton from '../../../../_sharedComponents/ImageButton';
import windowStateAtom from '../../../_atoms/windowStateAtom';
import humanizeCollection from '../../../_helpers/humanizeCollection';
import useAddCollectionQueryNode from '../../../_hooks/useAddCollectionQueryNode';
import humanizeSolana from '../../_helpers/humanizeSolana';
import SimilarCollections from './SimilarCollections';
import collectionOverviewAtom from './_atoms/collectionOverviewAtom';
import CollectionOverviewResponseType from './_types/CollectionOverviewResponseType';

const border = '1px solid #EEEEEE';

type Item = {
  label: string;
  getValue: (data: CollectionOverviewResponseType) => ReactNode;
};

const items: Item[] = [
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
  {
    label: 'Listed',
    getValue: ({ listed }) => listed.toLocaleString(),
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
      <Typography fontSize="0.85rem" color="#9BA6B1">
        {props.label}
      </Typography>
      <Typography
        fontWeight="bold"
        fontSize="0.8rem"
        sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        {props.value}
      </Typography>
    </Box>
  ) : null;
}

const CardContainer = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'white',
  border,
  padding: 24,
  width: '100%',
  height: '100%',
});

const ItemsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-around',
  width: '100%',
  border,
  marginBottom: 16,
});

function CollectionOverview() {
  const overview = useRecoilValue(collectionOverviewAtom);
  const windowState = useRecoilValue(windowStateAtom);
  const addCollectionQueryNode = useAddCollectionQueryNode();

  if (!overview) {
    return null;
  }

  const hasSimilar = !!overview.similar.length;
  const gridItemSize = hasSimilar ? 6 : 12;

  const goToCollection =
    windowState.type !== 'search'
      ? () => addCollectionQueryNode(overview.id, true)
      : undefined;

  return (
    <Grid container={true} spacing={2}>
      <Grid item={true} xs={12} md={gridItemSize}>
        <CardContainer>
          <ImageButton
            onClick={goToCollection}
            size={200}
            transitionDuration={1}
            images={overview.images}
          />
          <ButtonBase disabled={!goToCollection} onClick={goToCollection}>
            <Typography
              gutterBottom={true}
              variant="h5"
              component="div"
              sx={{ mt: 2 }}
            >
              {humanizeCollection(overview)}
            </Typography>
          </ButtonBase>
          {overview.description && (
            <Typography variant="body2" color="text.secondary">
              {overview.description}
            </Typography>
          )}
        </CardContainer>
      </Grid>
      <Grid item={true} xs={12} md={gridItemSize}>
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
        {hasSimilar && (
          <Box sx={{ border }}>
            <SimilarCollections overview={overview} />
          </Box>
        )}
      </Grid>
    </Grid>
  );
}

export default CollectionOverview;
