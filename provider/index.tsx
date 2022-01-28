import { ReactNode } from 'react'
import { RecoilRoot } from 'recoil'
import WalletProvider from './WalletProvider'

interface ProviderProps {
  children: ReactNode
}

const Provider = ({ children }: ProviderProps) => (
  <RecoilRoot>
    <WalletProvider>{children}</WalletProvider>
  </RecoilRoot>
)

export default Provider
