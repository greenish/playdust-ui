import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { selector } from 'recoil';
import solanaClusters from './solanaClusters';

export type SolanaClusterType = {
  network: WalletAdapterNetwork;
  endpoint: string;
};

const solanaCluster = selector<SolanaClusterType>({
  key: 'solanaCluster',
  get: ({ get }) => {
    const { clusters, selectedIndex } = get(solanaClusters);

    return clusters[selectedIndex];
  },
});

export default solanaCluster;
