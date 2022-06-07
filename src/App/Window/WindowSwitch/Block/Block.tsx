import React from 'react';
import { useRecoilValue } from 'recoil';
import blockStateAtom from './_atoms/blockStateAtom';

export const Block = () => {
  const block = useRecoilValue(blockStateAtom);
  const slot = Number(state);

  return (
    <>
      <BlockOverview />
      <BlockDetails />
    </>
  )
}

export default Block
