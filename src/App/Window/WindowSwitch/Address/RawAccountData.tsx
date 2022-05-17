import dynamic from 'next/dynamic';
import React from 'react';
import { useRecoilValue } from 'recoil';
import accountInfoAtom from './_atoms/accountInfoAtom';
import ExplorerAccordion from './_sharedComponents/ExplorerAccordion';

// react-json-view can only be client render since it uses window
const DynamicReactJson = dynamic(import('react-json-view'), {
  ssr: false,
});

function RenderRawAccountData() {
  const accountInfo = useRecoilValue(accountInfoAtom);

  const src = Buffer.isBuffer(accountInfo.data)
    ? accountInfo.data.toJSON()
    : accountInfo.data;
  return (
    <DynamicReactJson
      name={null}
      src={src}
      collapsed={3}
      groupArraysAfterLength={20}
    />
  );
}

function RawAccountData() {
  return (
    <ExplorerAccordion
      id="accountData"
      title="Account Data"
      content={<RenderRawAccountData />}
    />
  );
}

export default RawAccountData;
