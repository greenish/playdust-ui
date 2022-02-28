import { BlockResponse, Connection } from '@solana/web3.js'
import { selectorFamily, useRecoilValue } from 'recoil'
import solanaCluster from './solanaCluster'

export const fetchBlock = selectorFamily<BlockResponse | null, number>({
  key: 'block',
  get:
    (slot) =>
    async ({ get }) => {
      const { endpoint } = get(solanaCluster)

      const connection = new Connection(endpoint, 'confirmed')

      const block = await connection.getBlock(slot)

      return block
    },
})

export const useBlock = (slot: number) => useRecoilValue(fetchBlock(slot))
