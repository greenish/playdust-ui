import styled from '@emotion/styled';
import React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import safePromise from '../../../../_helpers/safePromise';
import searchResultsAtom from '../../../_atoms/searchResultsAtom';
import TokenGrid from '../../_sharedComponents/TokenGrid/TokenGrid';
import useFetchMoreSearchResults from './_hooks/useFetchMoreSearchResults';

const NoTokensContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 64px;
`;

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
      imageSize={225}
      contentHeight={70}
      cardGap={16}
      rowGap={16}
      tokens={hasValue ? loadable.contents.nfts : []}
      total={hasValue ? loadable.contents.total : 0}
      next={() => {
        safePromise(fetchMoreSearchResults());
      }}
    />
  );
}

export default SearchResults;
