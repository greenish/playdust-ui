import { Connection } from '@solana/web3.js'
import { selector } from 'recoil'
import * as store from './'

export const solanaClusterInfo = selector({
  key: 'solanaClusterInfo',
  get: async ({ get }) => {
    const cluster = get(store.solanaCluster)

    const { endpoint } = cluster

    const connection = new Connection(endpoint)

    const [firstAvailableBlock, epochSchedule, epochInfo, genesisHash] =
      await Promise.all([
        connection.getFirstAvailableBlock(),
        connection.getEpochSchedule(),
        connection.getEpochInfo(),
        connection.getGenesisHash(),
      ])

    const data = {
      ...cluster,
      firstAvailableBlock,
      epochSchedule,
      epochInfo,
      genesisHash,
    }

    return data
  },
})
