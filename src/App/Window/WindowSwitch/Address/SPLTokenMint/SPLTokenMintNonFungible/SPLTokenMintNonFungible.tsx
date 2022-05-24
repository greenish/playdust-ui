import React from 'react';
import { Grid, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import StatusEnumType from './_types/StatusEnumType'
import nftDetailsAtom from './_atoms/nftDetailsAtom'
import Header from './Header';
import Stats from './Stats';
import Attributes from './Attributes';
import Creators from './Creators';
import Details from './Details';
import Overview from './Overview';
import Trading from './Trading';
import { useRecoilValue } from 'recoil'
import addressStateAtom from '../../_atoms/addressStateAtom';

// 5fzi7TauBFdac94hvm8DcTVN7jrCwYmf6PLuT2TJA7oe
function SPLTokenMintNonFungible() {

    const [status, setStatus] = useState(StatusEnumType.None)
    const addressState = useRecoilValue(addressStateAtom);
    const nftDetails = useRecoilValue(nftDetailsAtom);

    if (!nftDetails.data.offChainData) {
        return null;
    }

    return (
        <>
            <Header />
            <Stats />
            <Trading />
            <Attributes />
            <Overview />
            <Creators />
            <Details />
        </>
    )
}

export default SPLTokenMintNonFungible;
