import styled from '@emotion/styled';
import { Divider } from '@mui/material';
import React from 'react';
import AttributeFilters from './AttributeFilters';
import OnlyListedSwitch from './OnlyListedSwitch/OnlyListedSwitch';
import RangeFilters from './RangeFilters/RangeFilters';
import SortFields from './SortFields/SortFields';

const RootContainer = styled.div`
  width: 300px;
  margin-right: 8px;
  margin-left: 16px;
  display: flex;
  flex-direction: column;
`;

function SearchSideBar() {
  return (
    <RootContainer>
      <SortFields />
      <OnlyListedSwitch />
      <RangeFilters />
      <br />
      <Divider />
      <br />
      <AttributeFilters />
    </RootContainer>
  );
}

export default SearchSideBar;
