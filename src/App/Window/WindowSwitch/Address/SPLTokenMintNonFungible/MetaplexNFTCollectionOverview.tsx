import React from 'react';
import { useRecoilValue } from 'recoil';
import SuspenseBoundary from '../../../../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import CollectionOverview from '../../_sharedComponents/CollectionOverview/CollectionOverview';
import collectionOverviewAtom from '../../_sharedComponents/CollectionOverview/_atoms/collectionOverviewAtom';
import ExplorerAccordion from '../_sharedComponents/ExplorerAccordion';

function MetaplexNFTCollectionOverview() {
  const overview = useRecoilValue(collectionOverviewAtom);

  if (!overview) {
    return null;
  }

  return (
    <SuspenseBoundary
      error={null}
      loading={null}
      content={
        <ExplorerAccordion
          id="collection-overview"
          title="Collection Overview"
          content={<CollectionOverview />}
        />
      }
    />
  );
}

export default MetaplexNFTCollectionOverview;
