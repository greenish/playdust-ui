import { Container, Stack } from '@mui/material';
import React from 'react';
import AccountOverviewCard from './AccountOverviewCard/AccountOverviewCard';
import RawAccountData from './RawAccountData';
import TokenAccounts from './TokenAccounts';
import Transactions from './Transactions/Transactions';
import WalletGallery from './WalletGallery/WalletGallery';
import ExplorerAccordion from './_sharedComponents/ExplorerAccordion';
import SuspenseBoundary from './_sharedComponents/SuspenseBoundary/SuspenseBoundary';

function Address() {
  return (
    <Container maxWidth="lg">
      <Stack spacing={2}>
        <SuspenseBoundary error={null} loading={null}>
          <AccountOverviewCard />
        </SuspenseBoundary>
        <WalletGallery />
        <TokenAccounts />
        <ExplorerAccordion
          id="transactions"
          title="Transactions"
          content={<Transactions />}
        />
        <RawAccountData />
      </Stack>
    </Container>
  );
}

export default Address;
