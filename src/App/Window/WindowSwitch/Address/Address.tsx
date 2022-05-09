import React from 'react';
import { useRecoilValue } from 'recoil';
import addressStateAtom from './_atoms/addressStateAtom';
import ExplorerCard from './_sharedComponents/ExplorerCard/ExplorerCard';
import ExplorerGrid from './_sharedComponents/ExplorerGrid';
import ExplorerLink from './_sharedComponents/ExplorerLink';

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
