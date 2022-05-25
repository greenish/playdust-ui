import React from 'react';
import SuspenseBoundary from '../../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import TableSkeleton from '../../_sharedComponents/TableSkeleton/TableSkeleton';
import SPLTokenMintFungibleHeader from './SPLTokenMintFungibleHeader';
import SPLTokenMintFungibleStats from './SPLTokenMintFungibleStats/SPLTokenMintFungibleStats';

// Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB
function SPLTokenMintFungible() {
  return (
    <>
      <SuspenseBoundary
        content={<SPLTokenMintFungibleHeader />}
        error={null}
        loading={<TableSkeleton />}
      />
      <SuspenseBoundary
        content={<SPLTokenMintFungibleStats />}
        error={null}
        loading={<TableSkeleton />}
      />
    </>
  );
}

export default SPLTokenMintFungible;
