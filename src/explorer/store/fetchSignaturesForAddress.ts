import { ConfirmedSignatureInfo, Connection } from '@solana/web3.js'
import { selectorFamily } from 'recoil'
import { solanaCluster } from '../../app/store'
import { pageIdx } from './pageIdx'

export const fetchSignaturesForAddress = selectorFamily<
  ConfirmedSignatureInfo[],
  any
>({
  key: 'signaturesForAddress',
  get:
    (pubkey) =>
    async ({ get }) => {
      get(pageIdx) // bust this cache every page

      const { endpoint } = get(solanaCluster)
      const connection = new Connection(endpoint)

      const signatures = await connection.getConfirmedSignaturesForAddress2(
        pubkey,
        {
          limit: 10,
        }
      )

      return signatures
    },
})
