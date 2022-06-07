import { ENV } from '@solana/spl-token-registry';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

interface SolanaClusterType {
  network: WalletAdapterNetwork;
  tokenRegistryENV: ENV;
  endpoint: string;
}

export default SolanaClusterType;
