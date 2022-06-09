import React from 'react';
import SuspenseBoundary from '../../../../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import CollectionNFTDetails from '../../_sharedComponents/CollectionNFTDetails/CollectionNFTDetails';
import ExplorerAccordion from '../_sharedComponents/ExplorerAccordion';

function MetaplexNFTCollectionDetails() {
  return (
    <SuspenseBoundary
      error={null}
      loading={null}
      content={
        <ExplorerAccordion
          id="collection-details"
          title="Collection Details"
          content={<CollectionNFTDetails />}
        />
      }
    />
  );
}

export default MetaplexNFTCollectionDetails;
