import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import '../styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  if (!router.isReady) {
    return null;
  }

  return (
    <>
      <Head>
        <title>playdust</title>
        <link rel="icon" href="/playdust-dark.svg" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default App;
