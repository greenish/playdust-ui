import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import searchResultsAtom from '../../_atoms/searchResultsAtom';
import type WindowProps from '../../_types/WindowPropsType';
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

function Search({ setWindowImages }: WindowProps) {
  const searchResults = useRecoilValueLoadable(searchResultsAtom);

  useEffect(() => {
    if (
      searchResults.state === 'hasValue' &&
      searchResults.contents.total > 0
    ) {
      const filtered = searchResults.contents.nfts
        .filter((nft) => nft?.offChainData?.image)
        .slice(0, 4)
        .map((nft) => nft?.offChainData?.image);

      if (filtered.length) {
        setWindowImages(filtered);
      }
    }
  }, [searchResults, setWindowImages]);

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
