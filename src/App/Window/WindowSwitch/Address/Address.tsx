import { Container, Stack } from '@mui/material';
import React from 'react';
import AccountOverviewCard from './AccountOverviewCard/AccountOverviewCard';
import AddressTransactions from './AddressTransactions/AddressTransactions';

function Address() {
  return (
    <Container maxWidth="lg">
      <Stack spacing={2}>
        <AccountOverviewCard />
        <AddressTransactions />
      </Stack>
    </Container>
  );
}

export default Address;
