import { useWallet } from '@solana/wallet-adapter-react'
import usePushWindowHash from './usePushWindowHash'

const useGoToProfile = () => {
  const wallet = useWallet()
  const pushWindowHash = usePushWindowHash()

  return () => {
    if (wallet.publicKey) {
      const state = wallet.publicKey.toBase58()
      pushWindowHash({ type: 'account', state }, { newTab: true })
    }
  }
}

export default useGoToProfile
