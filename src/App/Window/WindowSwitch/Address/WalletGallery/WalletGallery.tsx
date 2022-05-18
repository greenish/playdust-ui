import styled from '@emotion/styled';
import React from 'react';
import { useRecoilValue } from 'recoil';
import TokenCard from '../../_sharedComponents/TokenCard/TokenCard';
import ExplorerAccordion from '../_sharedComponents/ExplorerAccordion';
import nftsForAddressAtom from './_atoms/nftsForAddressAtom';

const RootContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
`;

function WalletGalleryContent() {
  const nfts = useRecoilValue(nftsForAddressAtom);

  if (!nfts.length) {
    return <i>No NFTs found...</i>;
  }

  return (
    <RootContainer>
      {nfts.map((nft) => (
        <TokenCard
          key={nft.mint}
          imageSize={225}
          contentHeight={70}
          metadata={nft}
          disableQuickFilter={true}
        />
      ))}
    </RootContainer>
  );
}

function WalletGallery() {
  return (
    <ExplorerAccordion
      id="wallet-gallery"
      title="NFTs"
      content={<WalletGalleryContent />}
    />
  );
}

export default WalletGallery;
