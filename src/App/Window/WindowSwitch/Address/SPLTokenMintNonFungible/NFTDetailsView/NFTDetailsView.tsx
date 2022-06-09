import { Box, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import shortenPublicKey from '../../../../../_helpers/shortenPublicKey';
import currentOwnerForMintAtom from '../../_atoms/currentOwnerForMintAtom';
import ContentContainer from '../../_sharedComponents/ContentContainer';
import playdustNftDataAtom from '../_atoms/playdustNftDataAtom';
import NFTDetailsRenderMedia from './NFTDetailsRenderMedia';

function NFTDetailsView() {
  const playdustNftData = useRecoilValue(playdustNftDataAtom);
  const ownerWalletAddress = useRecoilValue(currentOwnerForMintAtom);

  if (!playdustNftData || !playdustNftData.mintOffChainMetadata) {
    return null;
  }

  const offChainData = playdustNftData.mintOffChainMetadata;

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
                  sx={{
                    fontWeight: '400',
                    fontSize: '14px',
                    lineHeight: '168%',
                  }}
                >
                  {`Owner: ${shortenPublicKey(ownerWalletAddress)}`}
                </Typography>
              )}
              {playdustNftData.mintRarity && (
                <Box>
                  <Grid container={true} spacing={0}>
                    <Grid item={true} xs={12}>
                      <Typography sx={{ opacity: '0.5' }}>
                        Rarity Score
                      </Typography>
                    </Grid>
                    {playdustNftData.mintRarity.rarityScore && (
                      <Grid item={true} xs={6}>
                        <Typography>
                          {playdustNftData.mintRarity.rarityScore}
                        </Typography>
                      </Grid>
                    )}
                    {playdustNftData.mintRarity.normalizedRarityScore && (
                      <Grid item={true} xs={6}>
                        <Typography sx={{ opacity: '0.5' }}>
                          {`${playdustNftData.mintRarity.normalizedRarityScore.toPrecision(
                            2
                          )}%`}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </ContentContainer>
  );
}

export default NFTDetailsView;
