import React, { useEffect, PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import ReactGA from 'react-ga4';
import { useWallet } from '@solana/wallet-adapter-react';

const trackingID = process.env.GOOGLE_ANALYTICS_4_MEASUREMENT_ID;

const value = {};

const AnalyticsContext = React.createContext(value);

function AnalyticsProvider({ children }: PropsWithChildren<object>) {

  const router = useRouter();
  const wallet = useWallet();

  const handleRouteChange = () => { // (url: string) => {
    // ReactGA.set({ page: url });
    ReactGA.send('pageview'); // , url);
  };

  const handleHashChange = () => { // url: string) => {
    // ReactGA.set({ page: url });
    ReactGA.send('pageview'); // , url);
  };

  useEffect(
    () => {
      if (!trackingID) {
        throw new Error('No trackingID found.');
      }
      ReactGA.initialize(
        trackingID,
      );
    },
    [],
  );

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      ReactGA.set({ userId: wallet.publicKey })
    }
  }, [
    wallet.connected,
    wallet.publicKey,
  ]);

  useEffect(
    () => {

      router.events.on('routeChangeComplete', handleRouteChange);
      router.events.on('hashChangeComplete', handleHashChange);

      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
        router.events.off('hashChangeComplete', handleHashChange);
      };
    },
    [router],
  );

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

const useAnalytics = () => React.useContext(AnalyticsContext);

export { AnalyticsProvider, useAnalytics };
