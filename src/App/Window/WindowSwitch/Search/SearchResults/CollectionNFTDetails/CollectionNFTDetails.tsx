import { Box, Card, styled, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import { useRecoilValue } from 'recoil';
import ImageButton from '../../../../../_sharedComponents/ImageButton';
import OpenSearchCollectionSourceType from '../../../../_types/OpenSearchCollectionSourceType';
import ExplorerAccordion from '../../../Address/_sharedComponents/ExplorerAccordion';
import humanizeCollection from '../../../_helpers/humanizeCollection';
import humanizeSolana from '../../../_helpers/humanizeSolana';
import collectionOverviewAtom from '../../_atoms/collectionOverviewAtom';
import searchResultsAtom from '../../_atoms/searchResultsAtom';
import SimilarCollections from './SimilarCollections';

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

function CollectionNFTDetails() {
  const overview = useRecoilValue(collectionOverviewAtom);
  const searchResults = useRecoilValue(searchResultsAtom);

  if (!overview) {
    return null;
  }

  const images = searchResults.total
    ? searchResults.nfts
        .filter((nft) => nft?.offChainData?.image)
        .slice(0, 4)
        .map((nft) => nft?.offChainData?.image)
    : [];

  return (
    <Box>
      <CardContainer>
        <Box sx={{ display: 'flex' }}>
          <ImageButton size={200} transitionDuration={1} images={images} />
          <Box
            sx={{
              ml: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
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
          </Box>
        </Box>
      </CardContainer>

      {!!overview.similar.length && (
        <Box sx={{ mt: 3 }}>
          <ExplorerAccordion
            itemType="table"
            expanded={false}
            id="similar-collections"
            title="Similar NFT Collections found"
            content={<SimilarCollections overview={overview} />}
          />
        </Box>
      )}
    </Box>
  );
}

export default CollectionNFTDetails;
