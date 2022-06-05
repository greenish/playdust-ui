import { Box, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import shortenPublicKey from '../../../../../AppBar/WalletButton/_helpers/shortenPublicKey';
import ellipsisify from '../../../../../_helpers/ellipsisify';
import currentOwnerForMintAtom from '../../NFTTradingModule/_atoms/currentOwnerForMintAtom';
import ContentContainer from '../../_sharedComponents/ContentContainer';
import playdustNftDataAtom from '../_atoms/playdustNftDataAtom';
import NFTDetailsRenderMedia from './NFTDetailsRenderMedia';

function NFTDetailsView() {
  const playdustNftData = useRecoilValue(playdustNftDataAtom);
  const ownerWalletAddress = useRecoilValue(currentOwnerForMintAtom);

  if (!playdustNftData || !playdustNftData.metaplexOffChainData) {
    return null;
  }

  const offChainData = playdustNftData.metaplexOffChainData;

  return (
    <ContentContainer
      sx={{
        boxShadow: '0px 0px 10px 2px rgb(0,0,0, 0.2)',
        backgroundColor: '#FBFBFD',
      }}
    >
      <Box>
        <Grid container={true} spacing={0}>
          <Grid item={true} xs={6}>
            <NFTDetailsRenderMedia />
          </Grid>
          <Grid item={true} xs={6}>
            <Stack>
              <Typography
                sx={{
                  fontWeight: '700',
                  fontSize: '40px',
                  lineHeight: '156%;',
                }}
              >
                {offChainData.name}
              </Typography>
              <Typography
                sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '168%' }}
              >
                {offChainData.description}
              </Typography>
              {ownerWalletAddress && (
                <Typography
                  sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '168%' }}
                >
                  {`Owner: ${shortenPublicKey(ownerWalletAddress)}`}
                </Typography>
              )}
              <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.08);' }}>
                <Grid container={true} spacing={0}>
                  <Grid item={true} xs={12}>
                    <Typography sx={{ opacity: '0.5' }}>
                      Rarity Score
                    </Typography>
                  </Grid>
                  {playdustNftData.rarity.absoluteRarity && (
                    <Grid item={true} xs={6}>
                      <Typography>
                        {playdustNftData.rarity.absoluteRarity}
                      </Typography>
                    </Grid>
                  )}
                  {playdustNftData.rarity.normalizedRarity && (
                    <Grid item={true} xs={6}>
                      <Typography sx={{ opacity: '0.5' }}>
                        {`${playdustNftData.rarity.normalizedRarity.toPrecision(
                          2
                        )}%`}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </ContentContainer>
  );
}

export default NFTDetailsView;
