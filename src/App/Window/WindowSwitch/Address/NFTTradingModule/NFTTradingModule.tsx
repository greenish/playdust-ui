import styled from '@emotion/styled';
import ListAltSharpIcon from '@mui/icons-material/ListAltSharp';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
} from '@mui/material';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import connectedWalletAtom from '../../../../_atoms/connectedWalletAtom';
import SuspenseBoundary from '../../../../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import addressStateAtom from '../_atoms/addressStateAtom';
import parsedTokenAccountAtom from '../_atoms/parsedTokenAccountAtom';
import safePubkeyString from '../_helpers/safePubkeyString';
import ContentContainer from '../_sharedComponents/ContentContainer';
import CreateOfferListing from './CreateOfferListing';
import TradeButtons from './TradeButtons/TradeButtons';

const ButtonContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  justify-content: end;
  gap: 16px;
`;

function NFTTradingModule() {
  const [expanded, setExpanded] = useState(false);
  const addressState = useRecoilValue(addressStateAtom);
  const connectedWallet = useRecoilValue(connectedWalletAtom);
  const parsedTokenAccount = useRecoilValue(parsedTokenAccountAtom);

  if (
    !addressState ||
    !parsedTokenAccount ||
    parsedTokenAccount.type !== 'mint'
  ) {
    return null;
  }

  return (
    <ContentContainer>
      <Accordion expanded={expanded}>
        <AccordionSummary
          aria-controls="trading-module-content"
          aria-label="Playdust Trading Module"
          id="trading-module"
        >
          <ButtonContainer>
            <Button
              variant={expanded ? 'contained' : 'outlined'}
              size="medium"
              onClick={() => setExpanded(!expanded)}
            >
              <ListAltSharpIcon />
            </Button>
            <SuspenseBoundary
              content={
                <TradeButtons
                  mint={safePubkeyString(addressState.pubkey)}
                  publicKey={connectedWallet}
                  setExpanded={setExpanded}
                />
              }
              loading={
                <Button variant="outlined" disabled={true}>
                  <CircularProgress
                    size={20}
                    color="inherit"
                    sx={{ marginRight: '8px' }}
                  />{' '}
                  Loading Trading Module
                </Button>
              }
              error={null}
            />
          </ButtonContainer>
        </AccordionSummary>
        <AccordionDetails
          aria-labelledby="trading-module"
          id="trading-module-content"
        >
          <CreateOfferListing
            mint={safePubkeyString(addressState.pubkey)}
            publicKey={connectedWallet}
            setExpanded={setExpanded}
          />
        </AccordionDetails>
      </Accordion>
    </ContentContainer>
  );
}

export default NFTTradingModule;
