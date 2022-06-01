import { ENV } from '@solana/spl-token-registry';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { selector } from 'recoil';
import { assert, literal, string, union } from 'superstruct';
import type SolanaClusterType from '../../_types/SolanaClusterType';

const clusterStatics = {
  MAINNET: {
    network: WalletAdapterNetwork.Mainnet,
    tokenRegistryENV: ENV.MainnetBeta,
  },
  DEVNET: {
    network: WalletAdapterNetwork.Devnet,
    tokenRegistryENV: ENV.Devnet,
  },
};

const cluster = process.env.RPC_NODE_CLUSTER;
const endpoint = process.env.RPC_NODE_URL;

const solanaClusterAtom = selector<SolanaClusterType>({
  key: 'solanaClusterAtom',
  get: () => {
    assert(cluster, union([literal('MAINNET'), literal('DEVNET')]));
    assert(endpoint, string());

    const solanaCluster: SolanaClusterType = {
      ...clusterStatics[cluster],
      endpoint,
    };
    return solanaCluster;
  },
});

export default solanaClusterAtom;
