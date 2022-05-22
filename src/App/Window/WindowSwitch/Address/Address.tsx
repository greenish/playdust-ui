import { Container, Stack } from '@mui/material';
import React from 'react';
import AccountOverviewCard from './AccountOverviewCard/AccountOverviewCard';
import RawAccountData from './RawAccountData';
import SPLTokenAccount from './SPLTokenAccount';
import SPLTokenMint from './SPLTokenMint/SPLTokenMint';
import SPLTokenMultisig from './SPLTokenMultisig';
import StakeConfigAccountCard from './StakeConfigAccountCard';
import TokenAccounts from './TokenAccounts/TokenAccounts';
import Transactions from './Transactions/Transactions';
import ValidatorInfoConfigAccountCard from './ValidatorInfoConfigAccountCard';
import WalletGallery from './WalletGallery/WalletGallery';
import ExplorerAccordion from './_sharedComponents/ExplorerAccordion';
import SuspenseBoundary from './_sharedComponents/SuspenseBoundary/SuspenseBoundary';

function Address() {
  return (
    <Container maxWidth="lg">
      <Stack spacing={2}>
        <SuspenseBoundary
          content={<SPLTokenAccount />}
          error={null}
          loading={null}
        />
        <SuspenseBoundary
          content={<SPLTokenMint />}
          error={null}
          loading={null}
        />
        <SuspenseBoundary
          content={<SPLTokenMultisig />}
          error={null}
          loading={null}
        />
        <SuspenseBoundary
          content={<ValidatorInfoConfigAccountCard />}
          error={null}
          loading={null}
        />
        <SuspenseBoundary
          content={<StakeConfigAccountCard />}
          error={null}
          loading={null}
        />
        <SuspenseBoundary
          content={<AccountOverviewCard />}
          error={null}
          loading={null}
        />
        <SuspenseBoundary
          content={<WalletGallery />}
          error={null}
          loading={null}
        />
        <SuspenseBoundary
          content={<TokenAccounts />}
          error={null}
          loading={null}
        />
        <ExplorerAccordion
          id="transactions"
          title="Transactions"
          content={<Transactions />}
        />
        <SuspenseBoundary
          content={<RawAccountData />}
          error={null}
          loading={null}
        />
      </Stack>
    </Container>
  );
}

export default Address;
