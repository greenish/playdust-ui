import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

const MAINNET = {
  network: WalletAdapterNetwork.Mainnet,
  endpoint: 'https://api.mainnet-beta.solana.com',
}

const DEVNET = {
  network: WalletAdapterNetwork.Devnet,
  endpoint: 'https://api.devnet.solana.com',
}

type SolanaClustersType = {
  selectedIndex: number
  clusters: {
    network: WalletAdapterNetwork
    endpoint: string
  }[]
}

const solanaClusters = atom<SolanaClustersType>({
  key: 'solanaClusters',
  default: {
    selectedIndex: 0,
    clusters: [MAINNET, DEVNET],
  },
  effects: [persistAtom],
})

export default solanaClusters
