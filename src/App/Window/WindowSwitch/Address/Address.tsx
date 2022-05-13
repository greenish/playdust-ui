import { Container, Stack } from '@mui/material';
import React from 'react';
import AccountOverviewCard from './AccountOverviewCard/AccountOverviewCard';
import AddressOverviewCard from './AddressOverviewCard';

function Address() {
  return (
    <Container maxWidth="lg">
      <Stack spacing={2}>
        <AccountOverviewCard />
        <AddressOverviewCard />
      </Stack>
    </Container>
  );
}

export default Address;
