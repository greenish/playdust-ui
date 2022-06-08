import styled from '@emotion/styled';
import { Chip, Tooltip, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import useAddCollectionQueryNode from '../../../../_hooks/useAddCollectionQueryNode';
import humanizeSolana from '../../../_helpers/humanizeSolana';
import SimilarCollections from './SimilarCollections';
import collectionOverviewAtom from '../../_atoms/collectionOverviewAtom';

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
  const overview = useRecoilValue(collectionOverviewAtom);
  const addCollectionQueryNode = useAddCollectionQueryNode();

  const isPossibleDuplicate = useMemo(() => {
    if (!overview) {
      return false;
    }

    if (!overview.similar.length) {
      return false;
    }

    const highestVolume = overview.similar[0]?.totalVolume || 0;

    return highestVolume > overview.totalVolume;
  }, [overview]);

  if (!overview) {
    return null;
  }

  return (
    <RootContainer>
      <ChipContainer>
        <Typography sx={{ mr: 1 }}>&middot;</Typography>
        <Chip
          size="small"
          label={`Collection Volume: ${humanizeSolana(overview.totalVolume)}`}
          variant="outlined"
        />
        <Chip
          size="small"
          label={`Collection Items: ${overview.elementCount.toLocaleString()}`}
          variant="outlined"
        />
        {overview.similar.length && (
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
                  overview.similar.length === 20
                    ? '20+'
                    : overview.similar.length
                } Similar Collections`}
                variant="outlined"
                color={isPossibleDuplicate ? 'warning' : 'default'}
              />
            </Tooltip>
            <SimilarCollections
              open={similarOpen}
              onClose={() => setSimilarOpen(false)}
              onClick={(id) => addCollectionQueryNode(id, true)}
            />
          </>
        )}
      </ChipContainer>
    </RootContainer>
  );
}

export default CollectionOverview;
