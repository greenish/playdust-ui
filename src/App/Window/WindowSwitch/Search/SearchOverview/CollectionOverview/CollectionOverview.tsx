import styled from '@emotion/styled';
import FlagIcon from '@mui/icons-material/Flag';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
} from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userProfile } from '../../../../../../me/store';
import { setCollectionCensorStatus } from '../../../../../_helpers/playdustApi';
import safePromise from '../../../../../_helpers/safePromise';
import Status from '../../../../../_types/StatusEnumType';
import collectionStatusAtom from '../../../_atoms/collectionStatusAtom';
import humanizeSolana from '../../../_helpers/humanizeSolana';
import useInitCollectionQuery from '../../../_hooks/useInitCollectionQuery';
import collectionIdAtom from '../_atoms/collectionIdAtom';
import SimilarCollections from './SimilarCollections';
import collectionOverviewAtom from './_atoms/collectionOverviewAtom';
import useOpenFlaggedModal from './_hooks/useOpenFlaggedModal';

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChipContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

function CollectionOverview() {
  const [statusOpen, setStatusOpen] = useState(false);
  const [similarOpen, setSimilarOpen] = useState(false);
  const [status, setStatus] = useRecoilState(collectionStatusAtom);
  const [censorState, setCensorState] = useState(Status.None);
  const [cookies] = useCookies(['authToken']);
  const collectionId = useRecoilValue(collectionIdAtom);
  const overview = useRecoilValue(collectionOverviewAtom(collectionId));
  const { roles } = useRecoilValue(userProfile);
  const { publicKey } = useWallet();
  const openFlaggedModal = useOpenFlaggedModal();
  const initCollectionQuery = useInitCollectionQuery();

  const { totalVolume, similar, elementCount } = overview;

  const saveStatus = () => {
    const publicKeyString = publicKey?.toBase58();

    if (publicKeyString) {
      safePromise(
        setCollectionCensorStatus(collectionId, publicKeyString, status)
      );
    }

    setStatus(censorState);
    setStatusOpen(false);
  };

  const isPossibleDuplicate = useMemo(() => {
    if (!similar.length) {
      return false;
    }

    const highestVolume = similar[0]?.totalVolume || 0;

    return highestVolume > totalVolume;
  }, [similar, totalVolume]);

  return (
    <RootContainer>
      <ChipContainer>
        <Chip
          size="small"
          label={`Collection Volume: ${humanizeSolana(totalVolume)}`}
          variant="outlined"
        />
        <Chip
          size="small"
          label={`Collection Items: ${elementCount.toLocaleString()}`}
          variant="outlined"
        />
        {similar.length && (
          <>
            <Tooltip
              sx={{
                cursor: 'pointer',
              }}
              title="Other collections have been found with a similar name, description, or symbol. Click to view"
              onClick={() => setSimilarOpen(true)}
            >
              <Chip
                size="small"
                label={`${
                  similar.length === 20 ? '20+' : similar.length
                } Similar Collections`}
                variant="outlined"
                color={isPossibleDuplicate ? 'warning' : 'default'}
              />
            </Tooltip>
            <SimilarCollections
              collectionId={collectionId}
              open={similarOpen}
              onClose={() => setSimilarOpen(false)}
              onClick={initCollectionQuery}
            />
          </>
        )}
        {cookies.authToken ? ( // eslint-disable-line
          roles.length && roles.includes('admin') ? (
            <>
              <Button
                onClick={() => setStatusOpen(true)}
                color="primary"
                variant="outlined"
              >
                Change status
              </Button>
              <Dialog onClose={() => setStatusOpen(false)} open={statusOpen}>
                <DialogTitle>Change item status</DialogTitle>
                <DialogContent>
                  <RadioGroup
                    value={censorState}
                    onChange={(e) => setCensorState(Number(e.target.value))}
                  >
                    <FormControlLabel
                      value={Status.None}
                      control={<Radio />}
                      label="None"
                    />
                    <FormControlLabel
                      value={Status.Censored}
                      control={<Radio />}
                      label="Censor"
                    />
                    <FormControlLabel
                      value={Status.NSFW}
                      control={<Radio />}
                      label="NFSW"
                    />
                  </RadioGroup>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setStatusOpen(false)}>Cancel</Button>
                  <Button onClick={saveStatus}>Save</Button>
                </DialogActions>
              </Dialog>
            </>
          ) : (
            <Tooltip title="Report this collection">
              <IconButton
                onClick={() => openFlaggedModal(collectionId, 'Collection')}
              >
                <FlagIcon />
              </IconButton>
            </Tooltip>
          )
        ) : null}
      </ChipContainer>
    </RootContainer>
  );
}

export default CollectionOverview;
