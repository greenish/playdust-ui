import { selector } from 'recoil';
import SolanaClusterType from '../../_types/SolanaClusterType';
import solanaClusters from './solanaClustersAtom';

const solanaClusterAtom = selector<SolanaClusterType>({
  key: 'solanaClusterAtom',
  get: ({ get }) => {
    const { clusters, selectedIndex } = get(solanaClusters);

    return clusters[selectedIndex];
  },
});

export default solanaClusterAtom;
