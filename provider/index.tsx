import { ReactNode } from 'react'
import { CookiesProvider } from 'react-cookie'
import { RecoilRoot } from 'recoil'
import WalletProvider from './WalletProvider'

interface ProviderProps {
  children: ReactNode
}

const Provider = ({ children }: ProviderProps) => (
  <RecoilRoot>
    <CookiesProvider>
      <WalletProvider>{children}</WalletProvider>
    </CookiesProvider>
  </RecoilRoot>
)

export default Provider
