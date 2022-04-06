import { selector } from 'recoil'
import * as store from './'

export const solanaCluster = selector({
  key: 'solanaCluster',
  get: ({ get }) => {
    const { clusters, selectedIndex } = get(store.solanaClusters)

    return clusters[selectedIndex]
  },
})
