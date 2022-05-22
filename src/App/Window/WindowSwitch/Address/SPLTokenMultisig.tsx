import React from 'react';
import { useRecoilValue } from 'recoil';
import parsedTokenAccountAtom from './_atoms/parsedTokenAccountAtom';
import ExplorerCard from './_sharedComponents/ExplorerCard';
import ExplorerGrid from './_sharedComponents/ExplorerGrid';
import ExplorerGridRow from './_sharedComponents/ExplorerGridRow';
import LabeledAddressLink from './_sharedComponents/LabeledAddressLink/LabeledAddressLink';
import TableSkeleton from './_sharedComponents/TableSkeleton/TableSkeleton';

// Q6XprfkF8RQQKoQVG33xT88H7wi8Uk1B1CC7YAs69Gi
function SPLTokenMultisigRows() {
  const parsedTokenAccount = useRecoilValue(parsedTokenAccountAtom);

  if (!parsedTokenAccount || parsedTokenAccount.type !== 'multisig') {
    return null;
  }

  const { info } = parsedTokenAccount;

  return (
    <>
      <ExplorerGridRow
        label="Required Signers"
        value={info.numRequiredSigners}
      />
      <ExplorerGridRow label="Valid Signers" value={info.numValidSigners} />
      {info.signers.map((signer: string, idx) => (
        <ExplorerGridRow
          key={signer}
          label={`Signer ${idx + 1}`}
          value={<LabeledAddressLink to={signer} allowCopy={true} />}
        />
      ))}
    </>
  );
}

function SPLTokenMultisig() {
  return (
    <ExplorerCard loading={<TableSkeleton />} error={null}>
      <ExplorerGrid>
        <SPLTokenMultisigRows />
      </ExplorerGrid>
    </ExplorerCard>
  );
}

export default SPLTokenMultisig;
