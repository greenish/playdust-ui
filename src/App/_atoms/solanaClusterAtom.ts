import { selector } from 'recoil';
import SolanaClusterType from '../../_types/SolanaClusterType';
import solanaClusters from './solanaClustersAtom';

const solanaClusterAtom = selector<SolanaClusterType>({
  key: 'solanaClusterAtom',
  get: ({ get }) => {
    const { clusters, selectedIndex } = get(solanaClusters);

    const cluster = clusters[selectedIndex];

    if(!cluster) {
      throw new Error(`Invalid cluster index: ${selectedIndex}`);
    }

    return cluster;
  },
});

export default solanaClusterAtom;
