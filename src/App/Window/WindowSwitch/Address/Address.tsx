import React from 'react';
import { useRecoilValue } from 'recoil';
import ExplorerCard from './ExplorerCard/ExplorerCard';
import ExplorerGrid from './ExplorerGrid';
import ExplorerLink from './ExplorerLink/ExplorerLink';
import addressStateAtom from './_atoms/addressStateAtom';

function AddressOverview() {
  const addressState = useRecoilValue(addressStateAtom);

  const { pubkey, label } = addressState;

  const rows = [
    [
      'Address',
      <ExplorerLink type="address" to={pubkey.toBase58()} allowCopy={true} />,
    ],
    label && ['Address Label', label],
  ];

  return <ExplorerGrid rows={rows} />;
}

function Address() {
  return (
    <ExplorerCard skeleton="table">
      <AddressOverview />
    </ExplorerCard>
  );
}

export default Address;
