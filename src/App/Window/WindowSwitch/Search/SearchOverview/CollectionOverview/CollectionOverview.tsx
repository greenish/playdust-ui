import styled from '@emotion/styled';
import { Chip, Tooltip } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import humanizeSolana from '../../../_helpers/humanizeSolana';
import useInitCollectionQuery from '../../../_hooks/useInitCollectionQuery';
import collectionIdAtom from '../_atoms/collectionIdAtom';
import SimilarCollections from './SimilarCollections';
import collectionOverviewAtom from './_atoms/collectionOverviewAtom';

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChipContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

function CollectionOverview() {
  const [similarOpen, setSimilarOpen] = useState(false);
  const collectionId = useRecoilValue(collectionIdAtom);
  const overview = useRecoilValue(collectionOverviewAtom(collectionId));
  const initCollectionQuery = useInitCollectionQuery();

  const { totalVolume, similar, elementCount } = overview;

  const isPossibleDuplicate = useMemo(() => {
    if (!similar.length) {
      return false;
    }

    const highestVolume = similar[0]?.totalVolume || 0;

    return highestVolume > totalVolume;
  }, [similar, totalVolume]);

  return (
    <RootContainer>
      <ChipContainer>
        <Chip
          size="small"
          label={`Collection Volume: ${humanizeSolana(totalVolume)}`}
          variant="outlined"
        />
        <Chip
          size="small"
          label={`Collection Items: ${elementCount.toLocaleString()}`}
          variant="outlined"
        />
        {similar.length && (
          <>
            <Tooltip
              sx={{
                cursor: 'pointer',
              }}
              title="Other collections have been found with a similar name, description, or symbol. Click to view"
              onClick={() => setSimilarOpen(true)}
            >
              <Chip
                size="small"
                label={`${
                  similar.length === 20 ? '20+' : similar.length
                } Similar Collections`}
                variant="outlined"
                color={isPossibleDuplicate ? 'warning' : 'default'}
              />
            </Tooltip>
            <SimilarCollections
              collectionId={collectionId}
              open={similarOpen}
              onClose={() => setSimilarOpen(false)}
              onClick={initCollectionQuery}
            />
          </>
        )}
      </ChipContainer>
    </RootContainer>
  );
}

export default CollectionOverview;
