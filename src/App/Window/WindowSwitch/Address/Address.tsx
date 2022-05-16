import { Container, Stack } from '@mui/material';
import React from 'react';
import AccountOverviewCard from './AccountOverviewCard/AccountOverviewCard';
import ExplorerAccordion from './ExplorerAccordion';
import Transactions from './Transactions/Transactions';

function Address() {
  return (
    <Container maxWidth="lg">
      <Stack spacing={2}>
        <AccountOverviewCard />
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
