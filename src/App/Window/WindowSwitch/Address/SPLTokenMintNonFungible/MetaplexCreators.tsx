import CheckIcon from '@mui/icons-material/Check';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import ExplorerAccordion from '../../_sharedComponents/ExplorerAccordion';
import LabeledAddressLink from '../../_sharedComponents/LabeledAddressLink/LabeledAddressLink';
import playdustNftDataAtom from './_atoms/playdustNftDataAtom';

interface CreatorInfo {
  address: string;
  verified: boolean;
  share: number;
}

function MetaplexCreators() {
  const playdustNftData = useRecoilValue(playdustNftDataAtom);

  if (!playdustNftData || !playdustNftData.metaplexOnChainData) {
    return null;
  }

  const details = playdustNftData.metaplexOnChainData;

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
            {(details.creators ?? []).map((creator: CreatorInfo) => (
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

export default MetaplexCreators;
