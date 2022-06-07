import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
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

  if (!playdustNftData || !playdustNftData.metaplexOffChainData) {
    return null;
  }

  const offChainData = playdustNftData.metaplexOffChainData;

  return (
    <ContentContainer
      sx={{
        borderTop: '1px solid #e2e2e2',
        boxShadow: (theme) => `0px 10px 10px -10px ${theme.palette.grey[500]}`,
        backgroundColor: '#F6F6F6',
      }}
    >
      <Card sx={{ display: 'flex', backgroundColor: 'inherit' }}>
        <CardMedia component={NFTDetailsRenderMedia} />
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            sx={{
              fontWeight: '700',
              fontSize: '40px',
              lineHeight: 1.25,
            }}
          >
            {offChainData.name}
          </Typography>
          {ownerWalletAddress && (
            <Typography
              sx={{
                fontWeight: '400',
                fontSize: '14px',
              }}
            >
              <Box sx={{ opacity: 0.4 }} component="span">
                {'Owned by '}
              </Box>
              {shortenPublicKey(ownerWalletAddress)}
            </Typography>
          )}
          <Typography
            sx={{ fontWeight: '400', fontSize: '14px', mt: 2, mb: 2 }}
          >
            {offChainData.description}
          </Typography>
          <Box sx={{ backgroundColor: 'grey.300', width: '50%', p: 1, pl: 2 }}>
            <Typography sx={{ opacity: '0.5' }}>Rarity Score</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {playdustNftData.rarity.absoluteRarity && (
                <Typography sx={{ fontWeight: 600, fontSize: 28 }}>
                  {playdustNftData.rarity.absoluteRarity}
                </Typography>
              )}
              {playdustNftData.rarity.normalizedRarity && (
                <Typography sx={{ opacity: '0.5', ml: 2 }}>
                  {`${playdustNftData.rarity.normalizedRarity.toPrecision(3)}%`}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </ContentContainer>
  );
}

export default NFTDetailsView;
