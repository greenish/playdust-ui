import React from 'react';
import styled from '@emotion/styled'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid,
    Paper,
    Typography,
} from '@mui/material'
import nftDetailsAtom from './_atoms/nftDetailsAtom';
import { useRecoilValue } from 'recoil';

const Item = styled(Paper)`
	background-color: #f6f6f6;
	padding: 8px 8px 8px 16px;
`

interface AttributePair {
    trait_type: string
    value: string
}

type AttributeBoxProps = AttributePair

// color: #747474;

const AttributeBox = ({ trait_type, value }: AttributeBoxProps) => {
    return (
        <Grid item={true} xs={4}>
            <Item>
                <Typography sx={{ color: '#45575c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {trait_type}
                </Typography>
                <Typography sx={{ color: '#141414', fontWeight: '600' }}>{value}</Typography>
            </Item>
        </Grid>
    )
}

function Attributes() {

    const nftDetails = useRecoilValue(nftDetailsAtom);

    if (!nftDetails.data.offChainData) {
        return null;
    }

    const details = nftDetails.data;

    return (
        <Grid container={true} spacing={2}>
            {(details?.offChainData?.attributes || []).map(
                (attribute: AttributePair, index: number) => (
                    <AttributeBox key={index} {...attribute} />
                )
            )}
        </Grid>
    );
}

export default Attributes;
