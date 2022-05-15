import { Container, Stack } from '@mui/material';
import React from 'react';
import AccountOverviewCard from './AccountOverviewCard/AccountOverviewCard';
import TokenAccounts from './TokenAccounts/TokenAccounts';
import Transactions from './Transactions/Transactions';
import ExplorerAccordion from './_sharedComponents/ExplorerAccordion';

function Address() {
  return (
    <Container maxWidth="lg">
      <Stack spacing={2}>
        <AccountOverviewCard />
        <TokenAccounts />
        <ExplorerAccordion
          id="transactions"
          title="Transactions"
          content={<Transactions />}
        />
      </Stack>
    </Container>
  );
}

export default Address;
