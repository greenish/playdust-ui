import { BlockResponse, Connection } from '@solana/web3.js'
import { selectorFamily, useRecoilValue } from 'recoil'
import solanaClusterAtom from '../../App/_atoms/solanaClusterAtom'

export const fetchBlock = selectorFamily<BlockResponse | null, number>({
  key: 'block',
  get:
    (slot) =>
    async ({ get }) => {
      const { endpoint } = get(solanaClusterAtom)

      const connection = new Connection(endpoint, 'confirmed')

      const block = await connection.getBlock(slot)

      return block
    },
})

export const useBlock = (slot: number) => useRecoilValue(fetchBlock(slot))
