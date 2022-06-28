import { datadogRum } from '@datadog/browser-rum';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import getPDEnv from '../src/App/_helpers/getPDEnv';
import '../styles/globals.css';

const env = getPDEnv();

if (env !== 'local') {
  datadogRum.init({
    applicationId: 'ec89a6b0-1b64-4a87-bf7a-2d19cdcb339d',
    clientToken: 'pubb1b51268c7e297f09c00ffbe8e387553',
    site: 'datadoghq.com',
    service: 'playdust',
    env: getPDEnv(),
    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sampleRate: 100,
    premiumSampleRate: 100,
    trackInteractions: true,
    defaultPrivacyLevel: 'mask-user-input',
  });

  datadogRum.startSessionReplayRecording();
}

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  if (!router.isReady) {
    return null;
  }

  return (
    <>
      <Head>
        <title>playdust</title>
        <link rel="icon" href="/fav-icon-circle.svg" />
        <link rel="apple-touch-icon" href="/fav-icon-square.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
      {/* Hubspot Embed Code */}
      {getPDEnv() === 'production' && (
        <script
          type="text/javascript"
          id="hs-script-loader"
          async={true}
          defer={true}
          src="//js.hs-scripts.com/21785114.js"
        />
      )}
    </>
  );
}

export default App;
