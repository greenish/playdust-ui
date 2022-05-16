import { Container, Stack } from '@mui/material';
import React from 'react';
import AccountOverviewCard from './AccountOverviewCard/AccountOverviewCard';

function Address() {
  return (
    <Container maxWidth="lg">
      <Stack spacing={2}>
        <AccountOverviewCard />
      </Stack>
    </Container>
  );
}

export default Address;
