import styled from '@emotion/styled';
import { Chip, Skeleton } from '@mui/material';
import React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import humanizeSolana from '../../_helpers/humanizeSolana';
import searchOverviewAtom from './_atoms/searchOverviewAtom';
import type SearchOverviewResponseType from './_types/SearchOverviewResponseType';

const RootContainer = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  overflow-x: auto;
`;

const ChipContentContainer = styled.div`
  display: flex;
`;

const chips = [
  {
    label: 'Total Items',
    getValue: ({ total }: SearchOverviewResponseType) =>
      total && `~${total.toLocaleString()}`,
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
    label: 'Avg Price',
    getValue: ({ average }: SearchOverviewResponseType) =>
      humanizeSolana(average),
  },
  {
    label: 'Ceiling Price',
    getValue: ({ ceiling }: SearchOverviewResponseType) =>
      humanizeSolana(ceiling),
  },
];

function SearchOverview() {
  const searchOverview = useRecoilValueLoadable(searchOverviewAtom);

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
              {searchOverview.state === 'hasValue' ? (
                chip.getValue(searchOverview.contents)
              ) : (
                <Skeleton variant="text" width={35} sx={{ ml: 1}} />
              )}
            </ChipContentContainer>
          }
          variant="outlined"
        />
      ))}
    </RootContainer>
  );
}

export default SearchOverview;
