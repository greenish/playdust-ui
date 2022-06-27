import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import axios, { AxiosError } from 'axios';
import React, { KeyboardEvent, useRef, useState } from 'react';
import safePromise from '../../../../scripts/_helpers/safePromise';
import frontendApi from '../_helpers/frontendApi';
import Link from '../_sharedComponents/Link';
import PlaydustLogo from '../_sharedComponents/PlaydustLogo';
import HubspotErrorResponseType from './_types/HubspotErrorResponseType';
import HubspotSuccessResponseType from './_types/HubspotSuccessResponseType';

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

function InlineForm() {
  const [processing, setProcessing] = useState<boolean>(false);
  const [message, setMessage] = useState<{ color: string; text: string }>();

  const inputRef = useRef<HTMLInputElement>();

  const submitForm = async () => {
    if (!inputRef.current) {
      return;
    }

    const email = inputRef.current.value;

    if (!emailRegex.test(email)) {
      setMessage({ color: 'error', text: 'Please enter a valid email.' });
      return;
    }

    setProcessing(true);
    setMessage({ color: 'default', text: 'Submitting...' });

    try {
      const res = await frontendApi.post<HubspotSuccessResponseType>(
        '/join-waitlist',
        {
          email,
        }
      );

      setMessage({
        color: 'success',
        text: 'You have successfully joined our whitelist.',
      });

      const { redirectUri } = res.data;
      if (typeof redirectUri === 'string') {
        window.location.href = redirectUri;
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<HubspotErrorResponseType>;

        if (serverError.response) {
          if (
            serverError.response.status === 400 &&
            serverError.response.data.errors &&
            serverError.response.data.errors[0].errorType === 'INVALID_EMAIL'
          ) {
            setMessage({ color: 'error', text: 'Please enter a valid email.' });
            return;
          }
        }
      }

      setMessage({ color: 'error', text: 'An unknown error occurred.' });
    } finally {
      setProcessing(false);
    }
  };

  const handleKeyPress = async (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      await submitForm();
    }
  };

  const handleClickButton = async () => {
    await submitForm();
  };

  return (
    <Box sx={{ mt: 6, mb: 2 }}>
      <Grid
        container={true}
        spacing={2}
        alignItems="stretch"
        justifyContent="center"
      >
        <Grid item={true}>
          <TextField
            inputRef={inputRef}
            placeholder="Enter your email..."
            variant="outlined"
            size="small"
            inputProps={{ size: 32 }}
            onKeyPress={(...args) => safePromise(handleKeyPress(...args))}
            disabled={processing}
          />
        </Grid>
        <Grid item={true}>
          <Button
            variant="contained"
            sx={{ height: '100%', fontSize: '16px', fontWeight: 500 }}
            onClick={() => safePromise(handleClickButton())}
            disabled={processing}
          >
            Join The Waitlist
          </Button>
        </Grid>
      </Grid>
      {message && (
        <Typography
          color={message?.color || 'default'}
          sx={{ visibility: message ? 'visible' : 'hidden', padding: '4px' }}
        >
          {message?.text || '-'}
        </Typography>
      )}
    </Box>
  );
}

function Section({ header, body }: { header: string; body: string }) {
  return (
    <Box sx={{ mb: 5, whiteSpace: 'pre-wrap' }}>
      <Typography variant="h6" gutterBottom={true} fontWeight={600}>
        {header}
      </Typography>
      <Typography variant="body1">{body}</Typography>
    </Box>
  );
}

function JoinTheWhitelist() {
  return (
    <Box
      sx={{
        p: 2,
        pt: 8,
        textAlign: 'center',
        overflow: 'auto',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box>
          <PlaydustLogo width="145px" />
        </Box>
        <Typography variant="body1" marginBottom="16px">
          Everything to know about NFTs on Solana
        </Typography>
        <InlineForm />
        <Typography variant="subtitle2" gutterBottom={true} sx={{ mb: 6 }}>
          By providing your email address, you are agreeing to our{' '}
          <Link
            href="https://info.playdust.com/terms-of-service?hsLang=en"
            target="_blank"
            rel="noreferrer"
          >
            terms of use
          </Link>{' '}
          and{' '}
          <Link
            href="https://info.playdust.com/privacy-policy?hsLang=en"
            target="_blank"
            rel="noreferrer"
          >
            privacy policy
          </Link>
          .
        </Typography>
        <Box>
          <Section
            header="Reimagining NFTs"
            body={`We're building the most intuitive and powerful\nplatform for digital assets on Solana.`}
          />
          <Section
            header="Playdust is for you"
            body={`Whether you're a collector, trader, creator, or just jpg-\ncurious, we've got you covered.`}
          />
          <Section
            header="Sign up for access"
            body={`Our closed beta will launch soon. We'll whitelist you\nfor our Playdust NFT drop as a thank you.`}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default JoinTheWhitelist;
