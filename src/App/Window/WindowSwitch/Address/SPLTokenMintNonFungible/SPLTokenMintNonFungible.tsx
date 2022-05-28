import React from 'react';
import nftDetailsAtom from './_atoms/nftDetailsAtom'
import Header from './Header/Header';
import Attributes from './Attributes';
import Creators from './Creators';
import { useRecoilValue } from 'recoil'
import ContentContainer from '../ContentContainer';

// 5fzi7TauBFdac94hvm8DcTVN7jrCwYmf6PLuT2TJA7oe
function SPLTokenMintNonFungible() {
  const nftDetails = useRecoilValue(nftDetailsAtom);

  if (!nftDetails.data.offChainData) {
    return null;
  }

  return (
    <ContentContainer >
      <Header />
      <Attributes />
      <Creators />
    </ContentContainer>
  )
}

export default SPLTokenMintNonFungible;
