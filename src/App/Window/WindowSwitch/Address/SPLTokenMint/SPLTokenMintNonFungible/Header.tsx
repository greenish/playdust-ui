import styled from '@emotion/styled'
import { Box, Grid, Typography } from '@mui/material'
import React from 'react';
import { useRecoilValue } from 'recoil';
import Image from './Image';
import Tools from './Tools';
import nftDetailsAtom from './_atoms/nftDetailsAtom';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import ShareIcon from '@mui/icons-material/Share';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import VerifiedIcon from '@mui/icons-material/Verified';

const MasterButton = styled(Box)`
box-sizing: border-box;

/* Auto layout */

display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding: 0px;

width: 129px;
height: 129px;

background: #FFFFFF;
border: 6px solid #09BC8A;
border-radius: 104px;

/* Inside auto layout */

flex: none;
order: 1;
flex-grow: 0;
`;

function Header() {

    const nftDetails = useRecoilValue(nftDetailsAtom);

    if (!nftDetails.data.offChainData) {
        return null;
    }

    return (
        <Box sx={{ padding: '24px', backgroundColor: '#091D58', color: 'white' }}>
            <Grid container={true} spacing={0}>
                <Grid item={true} xs={6}>
                    <Image />
                </Grid>
                <Grid item={true} xs={6}>
                    <Grid container={true} spacing={0}>
                        <Grid item={true} xs={6}>
                            <Typography sx={{ fontWeight: '700', fontSize: '40px', lineHeight: '156%;' }}>
                                {nftDetails.data.data.name}
                            </Typography>
                        </Grid>
                        <Grid item={true} xs={6}>
                            <MasterButton>Buy</MasterButton>
                        </Grid>
                    </Grid>
                    <Grid container={true} spacing={1}>
                        <Grid item={true} xs={7}>
                            <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.08);' }}>
                                <Grid container={true} spacing={0}>
                                    <Grid item={true} xs={12}>
                                        <Typography sx={{ opacity: '0.5' }}>
                                            Rarity Score
                                        </Typography>
                                    </Grid>
                                    <Grid item={true} xs={6}>
                                        <Typography>0</Typography>
                                    </Grid>
                                    <Grid item={true} xs={6}>
                                        <Typography sx={{ opacity: '0.5' }}>
                                          12%
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item={true} xs={5}>
                            <Grid container={true} spacing={1}>
                                <Grid item={true} xs={12}>
                                    <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.08);' }}>Make an Offer</Box>
                                </Grid>
                                <Grid item={true} xs={4}>
                                    <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.08);' }}>
                                        <StarOutlineIcon />
                                    </Box>
                                </Grid>
                                <Grid item={true} xs={4}>
                                    <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.08);' }}>
                                        <ShareIcon />
                                    </Box>
                                </Grid>
                                <Grid item={true} xs={4}>
                                    <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.08);' }}>
                                        <ReportGmailerrorredIcon />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item={true} xs={12}>
                        <Typography sx={{ fontWeight: '400', fontSize: '14px', lineHeight: '168%' }}>
                            {nftDetails.data.offChainData.description}
                        </Typography>
                    </Grid>
                    <Grid item={true} xs={12}>
                        <VerifiedIcon /> Verified
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Header;
