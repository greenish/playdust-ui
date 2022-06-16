import styled from '@emotion/styled';
import { Chip, Skeleton } from '@mui/material';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useRecoilValueLoadable } from 'recoil';
import humanizeSolana from '../../_helpers/humanizeSolana';
import searchOverviewAtom from './_atoms/searchOverviewAtom';
import type SearchOverviewResponseType from './_types/SearchOverviewResponseType';

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
    <Scrollbars
      autoHide={true}
      style={{ height: 48 }}
      renderView={({
        style,
        ...divProps
      }: React.HTMLAttributes<HTMLDivElement>) => (
        <div
          style={{
            ...style,
            display: 'flex',
            alignItems: 'center',
          }}
          {...divProps}
        />
      )}
    >
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
                <Skeleton variant="text" width={35} />
              )}
            </ChipContentContainer>
          }
          variant="outlined"
        />
      ))}
    </Scrollbars>
  );
}

export default SearchOverview;
