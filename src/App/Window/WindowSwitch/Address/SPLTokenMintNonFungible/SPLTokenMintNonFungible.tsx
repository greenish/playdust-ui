import React from 'react';
import { useRecoilValue } from 'recoil';
import ContentContainer from '../_sharedComponents/ContentContainer';
import Attributes from './Attributes';
import Creators from './Creators';
import Header from './Header/Header';
import RawMetaplexOffChainMetadata from './RawMetaplexOffChainMetadata';
import RawMetaplexOnChainMetadata from './RawMetaplexOnChainMetadata';
import playdustNftDataAtom from './_atoms/playdustNftDataAtom';

// 5fzi7TauBFdac94hvm8DcTVN7jrCwYmf6PLuT2TJA7oe
function SPLTokenMintNonFungible() {
  const playdustNftData = useRecoilValue(playdustNftDataAtom);

  if (!playdustNftData) {
    return null;
  }

  return (
    <>
      <Header />
      <ContentContainer>
        <Attributes />
        <Creators />
        <RawMetaplexOnChainMetadata />
        <RawMetaplexOffChainMetadata />
      </ContentContainer>
    </>
  );
}

export default SPLTokenMintNonFungible;
