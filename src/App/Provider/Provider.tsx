import { PropsWithChildren } from 'react'
import { CookiesProvider } from 'react-cookie'
import { RecoilRoot } from 'recoil'
import ThemeProvider from './ThemeProvider'
import WalletProvider from './WalletProvider'

const Provider = ({ children }: PropsWithChildren<{}>) => (
  <RecoilRoot>
    <CookiesProvider>
      <ThemeProvider>
        <WalletProvider>{children}</WalletProvider>
      </ThemeProvider>
    </CookiesProvider>
  </RecoilRoot>
)

export default Provider
