import React from 'react';
import CheckIcon from '@mui/icons-material/Check'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import {
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material'
import { useRecoilValue } from 'recoil';
import LabeledAddressLink from '../_sharedComponents/LabeledAddressLink/LabeledAddressLink';
import nftDetailsAtom from './_atoms/nftDetailsAtom';
import ExplorerAccordion from '../_sharedComponents/ExplorerAccordion';

interface CreatorInfo {
    address: string
    verified: boolean
    share: number
}

function Creators() {

    const nftDetails = useRecoilValue(nftDetailsAtom);

    if (!nftDetails.data.offChainData) {
        return null;
    }

    const details = nftDetails.data;

    return (
        <ExplorerAccordion
            title="NFT Creators"
            expanded={true}
            content={
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Creator Address</TableCell>
                            <TableCell>Royalty</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(details?.data?.creators || []).map((creator: CreatorInfo) => (
                            <TableRow key={creator.address}>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                    <Stack direction="row" alignItems="center" gap={1}>
                                        {creator.verified ? (
                                            <CheckIcon />
                                        ) : (
                                            <ReportGmailerrorredIcon />
                                        )}{' '}
                                        <LabeledAddressLink to={creator.address} />
                                    </Stack>
                                </TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                    {creator.share}%
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            }
        />
    );
}

export default Creators;
