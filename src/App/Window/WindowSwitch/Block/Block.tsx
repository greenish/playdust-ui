import React from 'react';
import SuspenseBoundary from '../../../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import ContentContainer from '../_sharedComponents/ContentContainer';
import BlockDetails from './BlockDetails/BlockDetails';
import BlockOverview from './BlockOverview/BlockOverview';

function Block() {
  return (
    <ContentContainer>
      <SuspenseBoundary
        content={<BlockOverview />}
        error={null}
        loading={null}
      />
      <SuspenseBoundary
        content={<BlockDetails />}
        error={null}
        loading={null}
      />
    </ContentContainer>
  );
}

export default Block;
