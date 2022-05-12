import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

interface SolanaClusterType {
  network: WalletAdapterNetwork;
  endpoint: string;
}

export default SolanaClusterType;
