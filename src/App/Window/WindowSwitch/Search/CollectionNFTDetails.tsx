import { Box, Card, Typography } from '@mui/material';
import React from 'react';

function OverviewItem() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        ':not(:last-child)': {
          borderRight: '1px solid #EEEEEE',
        },
      }}
    >
      <div>Total Volume</div>
      <div>23.4</div>
    </Box>
  );
}

function CollectionNFTDetails() {
  return (
    <Card
      sx={{
        display: 'flex',
        backgroundColor: 'white',
        border: '1px solid #EEEEEE',
        pb: 0,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 3 }}>
          <Typography gutterBottom={true} variant="h5" component="div">
            Degenerate Ape Academy
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Our mission here at the academy is simple: Take 10,000 of the
            smoothest brained apes, put them all in one location and let the
            mayhem ensue. The academy was founded on the principles of
            friendship making, crayon eating and absolute, unregulated,
            deplorable, degenerate behaviour. Welcome fellow apes, to the
            Degenerate Ape Academy.
          </Typography>
        </Box>
        <Box
          sx={{
            borderTop: '1px solid #EEEEEE',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <OverviewItem />
          <OverviewItem />
          <OverviewItem />
          <OverviewItem />
          <OverviewItem />
        </Box>
      </Box>
    </Card>
  );
}

export default CollectionNFTDetails;
