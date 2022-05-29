import styled from '@emotion/styled';
import React from 'react';
import { useRecoilValue } from 'recoil';
import TokenCard from '../../_sharedComponents/TokenCard/TokenCard';
import useIsWallet from '../_hooks/useIsWallet';
import ExplorerAccordion from '../_sharedComponents/ExplorerAccordion/ExplorerAccordion';
import PaginatedList from '../_sharedComponents/PaginatedList';
import nftsForAddressAtom from './_atoms/nftsForAddressAtom';

const RootContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  gap: 16px;
  padding-bottom: 16px;
  padding-top: 16px;
  ::after {
    content: '';
    flex: auto;
  }
`;

function WalletGalleryContent() {
  const nfts = useRecoilValue(nftsForAddressAtom);

  if (!nfts.length) {
    return <i>No NFTs found...</i>;
  }

  return (
    <PaginatedList
      items={nfts}
      itemsPerPage={15}
      renderContainer={(children) => <RootContainer>{children}</RootContainer>}
      renderItem={(nft) => (
        <TokenCard
          key={nft.mint}
          imageSize={225}
          contentHeight={70}
          metadata={nft}
          disableQuickFilter={true}
        />
      )}
    />
  );
}

function WalletGallery() {
  const isWallet = useIsWallet();

  if (!isWallet) {
    return null;
  }

  return (
    <ExplorerAccordion
      id="wallet-gallery"
      title="NFTs"
      content={<WalletGalleryContent />}
    />
  );
}

export default WalletGallery;
