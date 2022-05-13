import React from 'react';
import { useRecoilValue } from 'recoil';
import addressStateAtom from './_atoms/addressStateAtom';
import ExplorerCard from './_sharedComponents/ExplorerCard/ExplorerCard';
import ExplorerGrid from './_sharedComponents/ExplorerGrid';
import LabeledAddressLink from './_sharedComponents/LabeledAddressLink/LabeledAddressLink';
import ExplorerGridRowType from './_types/ExplorerGridRowType';

function AddressOverviewCard() {
  const addressState = useRecoilValue(addressStateAtom);

  const { pubkey, label } = addressState;

  const rows: ExplorerGridRowType[] = [
    ['Address', <LabeledAddressLink pubkey={pubkey} allowCopy={true} />],
    label !== undefined && ['Address Label', label],
  ];

  return (
    <ExplorerCard skeleton="table">
      <ExplorerGrid rows={rows} />
    </ExplorerCard>
  );
}

export default AddressOverviewCard;
