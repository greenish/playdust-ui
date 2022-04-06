import { Connection } from '@solana/web3.js'
import { selectorFamily, useRecoilValue } from 'recoil'
import { solanaClusterInfo } from '../../app/store'

type EpochDetails = {
  currentEpoch: number
  firstSlot: number
  lastSlot: number
  firstBlock: number
  firstTimestamp: number | null
  lastBlock?: number
  lastTimestamp: number | null
}

export const fetchEpoch = selectorFamily<EpochDetails, number>({
  key: 'epoch',
  get:
    (epoch) =>
    async ({ get }) => {
      const { endpoint, epochSchedule, epochInfo } = get(solanaClusterInfo)

      const currentEpoch = epochInfo.epoch

      const connection = new Connection(endpoint, 'confirmed')

      const firstSlot = epochSchedule.getFirstSlotInEpoch(epoch)
      const lastSlot = epochSchedule.getLastSlotInEpoch(epoch)
      const [firstBlock, lastBlock] = await Promise.all([
        (async () => {
          const firstBlocks = await connection.getBlocks(
            firstSlot,
            firstSlot + 100
          )
          return firstBlocks.shift()
        })(),
        (async () => {
          const lastBlocks = await connection.getBlocks(
            Math.max(0, lastSlot - 100),
            lastSlot
          )
          return lastBlocks.pop()
        })(),
      ])

      if (firstBlock === undefined) {
        throw new Error(
          `failed to find confirmed block at start of epoch ${epoch}`
        )
      } else if (epoch < currentEpoch && lastBlock === undefined) {
        throw new Error(
          `failed to find confirmed block at end of epoch ${epoch}`
        )
      }

      const [firstTimestamp, lastTimestamp] = await Promise.all([
        connection.getBlockTime(firstBlock),
        lastBlock ? connection.getBlockTime(lastBlock) : null,
      ])

      return {
        currentEpoch,
        firstSlot,
        lastSlot,
        firstBlock,
        firstTimestamp,
        lastBlock,
        lastTimestamp,
      }
    },
})

export const useEpoch = (epoch: number) => useRecoilValue(fetchEpoch(epoch))
