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
        <link rel="icon" href="/fav-icon-circle.svg" />
        <link rel="apple-touch-icon" href="/fav-icon-square.svg" />
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
        <script>
          {`(function(s,t,a,n){s[t] || (s[t] = a, n = s[a] = function () { n.q.push(arguments) },
            n.q = [], n.v = 2, n.l = 1 * new Date)})(window,"InstanaEumObject","ineum");

          ineum('reportingUrl', 'https://eum-coral-saas.instana.io');
          ineum('key', '1B3NJfo-SYO74INLQP0RmQ');
          ineum('trackSessions');
          `}
        </script>
        <script
          defer={true}
          crossOrigin="anonymous"
          src="https://eum.instana.io/eum.min.js"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default App;
