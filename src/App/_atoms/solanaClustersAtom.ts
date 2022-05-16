import { ENV } from '@solana/spl-token-registry';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import type SolanaClusterType from '../../_types/SolanaClusterType';

const { persistAtom } = recoilPersist();

const MAINNET: SolanaClusterType = {
  network: WalletAdapterNetwork.Mainnet,
  tokenRegistryENV: ENV.MainnetBeta,
  endpoint:
    'https://polished-young-mountain.solana-mainnet.quiknode.pro/53eaa4a0729b507f78443988672faf40c0a29eb5/', // 'https://explorer-api.mainnet-beta.solana.com/', // 'https://solana-api.projectserum.com', 'https://api.mainnet-beta.solana.com',
};

const DEVNET: SolanaClusterType = {
  network: WalletAdapterNetwork.Devnet,
  tokenRegistryENV: ENV.Devnet,
  endpoint:
    'https://wispy-damp-violet.solana-devnet.quiknode.pro/9150f53f1702a07cf569fcad3d7048c388b69676/', // 'https://api.devnet.solana.com',
};

type SolanaClustersType = {
  selectedIndex: number;
  clusters: SolanaClusterType[];
};

const solanaClustersAtom = atom<SolanaClustersType>({
  key: 'solanaClusters',
  default: {
    selectedIndex: 0,
    clusters: [MAINNET, DEVNET],
  },
  effects: [persistAtom],
});

export default solanaClustersAtom;
