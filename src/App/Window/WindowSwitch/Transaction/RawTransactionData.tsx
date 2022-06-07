import dynamic from 'next/dynamic';
import React from 'react';
import { useRecoilValue } from 'recoil';
import ExplorerAccordion from '../_sharedComponents/ExplorerAccordion';
import parsedConfirmedTransactionAtom from './_atoms/parsedConfirmedTransactionAtom';

// react-json-view can only be client render since it uses window
const DynamicReactJson = dynamic(import('react-json-view'), {
  ssr: false,
});

function RawTransactionData() {
  const parsedConfirmedTransaction = useRecoilValue(
    parsedConfirmedTransactionAtom
  );

  if (!parsedConfirmedTransaction) {
    return <div>No data available</div>;
  }

  return (
    <ExplorerAccordion
      id="raw-transaction-data"
      title="Raw Transaction Data"
      expanded={true}
      content={
        <DynamicReactJson
          name={null}
          src={{ a: 0, b: 1 }}
          collapsed={3}
          groupArraysAfterLength={20}
        />
      }
    />
  );
}

export default RawTransactionData;