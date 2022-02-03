import { selector } from 'recoil'
import solanaClusters from './solanaClusters'

const solanaCluster = selector({
  key: 'solanaCluster',
  get: ({ get }) => {
    const { clusters, selectedIndex } = get(solanaClusters)

    return clusters[selectedIndex]
  },
})

export default solanaCluster
