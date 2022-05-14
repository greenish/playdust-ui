import styled from '@emotion/styled';
import React, { useMemo } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import safePromise from '../../../_helpers/safePromise';
import humanizeCollection from '../_helpers/humanizeCollection';
import humanizeSolana from '../_helpers/humanizeSolana';
import useInitCollectionQuery from '../_hooks/useInitCollectionQuery';
import TokenGrid from '../_sharedComponents/TokenGrid/TokenGrid';
import topCollectionsAtom from './_atoms/topCollectionsAtom';
import useFetchMoreTopCollections from './_hooks/useFetchMoreTopCollections';

const RootContainer = styled.div`
  padding: 0 16px;
  overflow: hidden;
  height: 100%;
  width: 100%;
`;

function Home() {
  const topCollectionsLoadable = useRecoilValueLoadable(topCollectionsAtom);
  const fetchMore = useFetchMoreTopCollections();
  const initCollectionQuery = useInitCollectionQuery('href');
  const hasValue = topCollectionsLoadable.state === 'hasValue';

  const grouped = useMemo(() => {
    if (hasValue) {
      const { results } = topCollectionsLoadable.contents;

      return results.map(({ collection, nfts }) => ({
        key: collection.id,
        groupLabel: humanizeCollection(collection),
        groupSecondary: humanizeSolana(collection.totalVolume),
        groupHref: initCollectionQuery(collection.id),
        groupTotal: collection.elementCount,
        nfts,
      }));
    }

    return [];
  }, [hasValue, initCollectionQuery, topCollectionsLoadable.contents]);

  return (
    <RootContainer>
      <TokenGrid
        initialized={hasValue}
        grouped={grouped}
        totalRows={hasValue ? topCollectionsLoadable.contents.total : 0}
        imageSize={150}
        cardGap={16}
        rowGap={24}
        contentHeight={0}
        next={() => {
          safePromise(fetchMore());
        }}
      />
    </RootContainer>
  );
}

export default Home;
