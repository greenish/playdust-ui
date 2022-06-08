import styled from '@emotion/styled';
import React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import TokenGrid from '../../_sharedComponents/TokenGrid/TokenGrid';
import CollectionNFTDetails from './CollectionNFTDetails';
import collectionOverviewAtom from '../_atoms/collectionOverviewAtom';
import searchResultsAtom from '../_atoms/searchResultsAtom';
import useFetchMoreSearchResults from './_hooks/useFetchMoreSearchResults';

const NoTokensContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 64px;
`;

function CollectionOverview() {
  const overview = useRecoilValueLoadable(collectionOverviewAtom);

  return (
    <CollectionNFTDetails
      skeleton={overview.state === 'loading'}
      overview={
        overview.state === 'hasValue' && overview.contents
          ? overview.contents
          : null
      }
    />
  );
}

function SearchResults() {
  const loadable = useRecoilValueLoadable(searchResultsAtom);
  const fetchMoreSearchResults = useFetchMoreSearchResults();
  const hasValue = loadable.state === 'hasValue';

  if (hasValue && loadable.contents.total === 0) {
    return (
      <NoTokensContainer>
        <i>no results found...</i>
      </NoTokensContainer>
    );
  }

  return (
    <TokenGrid
      initialized={hasValue}
      imageSize={200}
      contentHeight={70}
      cardGap={16}
      rowGap={16}
      tokens={hasValue ? loadable.contents.nfts : []}
      total={hasValue ? loadable.contents.total : 0}
      next={fetchMoreSearchResults}
      content={<CollectionOverview />}
    />
  );
}

export default SearchResults;
