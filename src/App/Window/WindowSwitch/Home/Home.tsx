import styled from '@emotion/styled';
import React, { useEffect, useMemo } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import setWindowImagesAtom from '../../_atoms/setWindowImagesAtom';
import useAddCollectionQueryNode from '../../_hooks/useAddCollectionQueryNode';
import humanizeCollection from '../_helpers/humanizeCollection';
import humanizeSolana from '../_helpers/humanizeSolana';
import TokenGrid from '../_sharedComponents/TokenGrid/TokenGrid';
import topCollectionsAtom from './_atoms/topCollectionsAtom';
import useFetchMoreTopCollections from './_hooks/useFetchMoreTopCollections';

const RootContainer = styled.div`
  padding: 0 16px;
  overflow: auto;
  height: 100%;
  width: 100%;
`;

function Home() {
  const topCollectionsLoadable = useRecoilValueLoadable(topCollectionsAtom);
  const fetchMore = useFetchMoreTopCollections();
  const addCollectionQuery = useAddCollectionQueryNode('href');
  const hasValue = topCollectionsLoadable.state === 'hasValue';
  const setWindowImages = useRecoilValue(setWindowImagesAtom);

  useEffect(() => {
    if (setWindowImages) setWindowImages([]);
  }, [setWindowImages]);

  const grouped = useMemo(() => {
    if (hasValue) {
      const { results } = topCollectionsLoadable.contents;

      return results.map(({ collection, nfts }) => ({
        key: collection.id,
        groupLabel: humanizeCollection(collection),
        groupSecondary: humanizeSolana(collection.totalVolume),
        groupHref: addCollectionQuery(collection.id),
        groupTotal: collection.elementCount,
        nfts,
      }));
    }

    return [];
  }, [hasValue, addCollectionQuery, topCollectionsLoadable.contents]);

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
        next={fetchMore}
      />
    </RootContainer>
  );
}

export default Home;
