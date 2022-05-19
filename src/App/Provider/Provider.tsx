import React, { PropsWithChildren } from 'react';
import { RecoilRoot } from 'recoil';
import ThemeProvider from './ThemeProvider';
import WalletProvider from './WalletProvider';

function Provider({ children }: PropsWithChildren<object>) {
  return (
    <RecoilRoot>
      <ThemeProvider>
        <WalletProvider>{children}</WalletProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default Provider;
