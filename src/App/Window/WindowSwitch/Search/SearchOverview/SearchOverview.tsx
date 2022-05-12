import styled from '@emotion/styled';
import { Chip, Skeleton, Typography } from '@mui/material';
import React, { Suspense } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import type SearchOverviewResponseType from '../../../../../_types/SearchOverviewResponseType';
import humanizeSolana from '../../_helpers/humanizeSolana';
import CollectionOverview from './CollectionOverview/CollectionOverview';
import collectionIdAtom from './_atoms/collectionIdAtom';
import searchOverviewAtom from './_atoms/searchOverviewAtom';

const RootContainer = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  overflow-x: scroll;
`;

const ChipContentContainer = styled.div`
  display: flex;
`;

const max = 10000;

const chips = [
  {
    label: 'Total Items',
    getValue: ({ count }: SearchOverviewResponseType) =>
      `${count.toLocaleString()}${count >= max ? '+' : ''}`,
  },
  {
    label: 'Listed Items',
    getValue: ({ listed }: SearchOverviewResponseType) =>
      listed.toLocaleString(),
  },
  {
    label: 'Floor Price',
    getValue: ({ floor }: SearchOverviewResponseType) => humanizeSolana(floor),
  },
  {
    label: 'Ceiling Price',
    getValue: ({ ceiling }: SearchOverviewResponseType) =>
      humanizeSolana(ceiling),
  },
];

function SearchOverview() {
  const { state, contents } = useRecoilValueLoadable(searchOverviewAtom);
  const collectionId = useRecoilValue(collectionIdAtom);

  return (
    <RootContainer>
      {chips.map((chip) => (
        <Chip
          key={chip.label}
          size="small"
          sx={{ mr: 1 }}
          label={
            <ChipContentContainer>
              {chip.label}:{' '}
              {state === 'hasValue' ? (
                chip.getValue(contents)
              ) : (
                <Skeleton variant="text" width={35} />
              )}
            </ChipContentContainer>
          }
          variant="outlined"
        />
      ))}
      {collectionId && (
        <Suspense fallback={null}>
          <Typography sx={{ mr: 1 }}>&middot;</Typography>
          <CollectionOverview />
        </Suspense>
      )}
    </RootContainer>
  );
}

export default SearchOverview;
