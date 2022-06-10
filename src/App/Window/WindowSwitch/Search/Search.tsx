import styled from '@emotion/styled';
import React from 'react';
import SearchOverview from './SearchOverview/SearchOverview';
import SearchResults from './SearchResults/SearchResults';
import SearchSideBar from './SearchSideBar/SearchSideBar';

const RootContainer = styled.div`
  display: flex;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

const RightContainer = styled.div`
  display: flex;
  overflow: hidden;
  width: 100%;
  height: 100%;
  flex-direction: column;
  margin-left: 16px;
`;

const TokenContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;

function Search() {
  return (
    <RootContainer>
      <SearchSideBar />
      <RightContainer>
        <SearchOverview />
        <TokenContainer>
          <SearchResults />
        </TokenContainer>
      </RightContainer>
    </RootContainer>
  );
}

export default Search;
