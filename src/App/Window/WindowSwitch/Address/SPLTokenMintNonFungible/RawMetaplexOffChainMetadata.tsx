import dynamic from 'next/dynamic';
import React from 'react';
import { useRecoilValue } from 'recoil';
import ExplorerAccordion from '../_sharedComponents/ExplorerAccordion';
import playdustNftDataAtom from './_atoms/playdustNftDataAtom';

// react-json-view can only be client render since it uses window
const DynamicReactJson = dynamic(import('react-json-view'), {
  ssr: false,
});

function RawMetaplexOffChainMetadata() {
  const playdustNftData = useRecoilValue(playdustNftDataAtom);

  if (!playdustNftData || !playdustNftData.metaplexOffChainData) {
    return null;
  }

  return (
    <ExplorerAccordion
      title="Raw Off-Chain Metaplex Metadata"
      content={
        <DynamicReactJson
          name={null}
          src={playdustNftData.metaplexOffChainData}
          collapseStringsAfterLength={50}
          groupArraysAfterLength={20}
        />
      }
    />
  );
}

export default RawMetaplexOffChainMetadata;
