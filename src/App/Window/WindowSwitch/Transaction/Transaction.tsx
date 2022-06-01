import React from 'react';
import SuspenseBoundary from '../../../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import AccountInputs from './AccountInputs';
import InstructionDetails from './InstructionDetails';
import ProgramLog from './ProgramLog';
import TransactionOverview from './TransactionOverview';

function Transaction() {
  return (
    <>
      <SuspenseBoundary
        content={<TransactionOverview />}
        error={null}
        loading={null}
      />
      <SuspenseBoundary
        content={<AccountInputs />}
        error={null}
        loading={null}
      />
      <SuspenseBoundary
        content={<InstructionDetails />}
        error={null}
        loading={null}
      />
      <SuspenseBoundary content={<ProgramLog />} error={null} loading={null} />
    </>
  );
}

export default Transaction;
