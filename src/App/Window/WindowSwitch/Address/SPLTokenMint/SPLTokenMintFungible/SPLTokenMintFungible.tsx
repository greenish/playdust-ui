import React from 'react';
import SuspenseBoundary from '../../../../../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import SkeletonRows from '../../../_sharedComponents/SkeletonRows';
import SPLTokenMintFungibleHeader from './SPLTokenMintFungibleHeader';
import SPLTokenMintFungibleStats from './SPLTokenMintFungibleStats/SPLTokenMintFungibleStats';
import SPLTokenMintFungibleOverview from './SPLTokenMintFungibleOverview';

// Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB
function SPLTokenMintFungible() {
  return (
    <>
      <SuspenseBoundary
        content={<SPLTokenMintFungibleHeader />}
        error={null}
        loading={<SkeletonRows />}
      />
      <SuspenseBoundary
        content={<SPLTokenMintFungibleStats />}
        error={null}
        loading={<SkeletonRows />}
      />
    </>
  );
}

export default SPLTokenMintFungible;
