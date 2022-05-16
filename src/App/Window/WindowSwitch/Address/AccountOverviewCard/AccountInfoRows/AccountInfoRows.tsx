import React from 'react';
import { useRecoilValue } from 'recoil';
import accountInfoAtom from './_atoms/accountInfoAtom';
import LabeledAddressLink from '../../_sharedComponents/LabeledAddressLink/LabeledAddressLink';
import SolBalance from '../../_sharedComponents/SolBalance/SolBalance';
import SuspenseBoundary from '../../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import ExplorerGridRow from '../_sharedComponents/ExplorerGridRow';

function AccountInfoRowsContent() {
  const accountInfo = useRecoilValue(accountInfoAtom);

  return (
    <>
      <ExplorerGridRow
        label="Balance (SOL)"
        value={<SolBalance lamports={accountInfo.lamports ?? 0} />}
      />
      {accountInfo.space !== undefined && (
        <ExplorerGridRow
          label="Allocated Data Size"
          value={`${accountInfo.space} byte(s)`}
        />
      )}
      {accountInfo.owner && (
        <ExplorerGridRow
          label="Assigned Program Id"
          value={<LabeledAddressLink to={accountInfo.owner} />}
        />
      )}
      <ExplorerGridRow
        label="Executable"
        value={accountInfo.executable ? 'Yes' : 'No'}
      />
    </>
  );
}

function AccountInfoRows() {
  return (
    <SuspenseBoundary error={null} loading={null}>
      <AccountInfoRowsContent />
    </SuspenseBoundary>
  );
}

export default AccountInfoRows;
