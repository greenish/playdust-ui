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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
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
    </>
  );
}

export default App;
