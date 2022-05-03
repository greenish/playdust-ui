import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import type { SolanaClusterType } from './solanaCluster'

const { persistAtom } = recoilPersist()

const MAINNET = {
  network: WalletAdapterNetwork.Mainnet,
  endpoint: 'https://explorer-api.mainnet-beta.solana.com/', // 'https://solana-api.projectserum.com', 'https://api.mainnet-beta.solana.com',
}

const DEVNET = {
  network: WalletAdapterNetwork.Devnet,
  endpoint: 'https://api.devnet.solana.com',
}

export type SolanaClustersType = {
  selectedIndex: number
  clusters: SolanaClusterType[]
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
