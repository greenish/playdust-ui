import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import addressStateAtom from '../../_atoms/addressStateAtom';
import parsedTokenAccountAtom from '../../_atoms/parsedTokenAccountAtom';
import tokenRegistryAtom from '../../_atoms/tokenRegistryAtom';
import safePubkeyString from '../../_helpers/safePubkeyString';

const IDENTICON_WIDTH = 64;

function SPLTokenMintFungibleHeader() {
  const addressState = useRecoilValue(addressStateAtom);
  const parsedTokenAccount = useRecoilValue(parsedTokenAccountAtom);
  const tokenRegistry = useRecoilValue(tokenRegistryAtom);

  if (
    !addressState ||
    !parsedTokenAccount ||
    parsedTokenAccount.type !== 'mint'
  ) {
    return null;
  }

  const tokenInfo = tokenRegistry.get(safePubkeyString(addressState.pubkey));

  const icon =
    tokenInfo && tokenInfo.logoURI ? (
      <img
        src={tokenInfo.logoURI}
        alt="token logo"
        style={{ width: IDENTICON_WIDTH }}
      />
    ) : null;

  return (
    <Box>
      <Grid container={true} spacing={1}>
        <Grid item={true}>{icon}</Grid>
        <Grid item={true}>
          <Typography variant="h5" component="h2" gutterBottom={true}>
            {tokenInfo?.name || 'Unknown Token'}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SPLTokenMintFungibleHeader;
