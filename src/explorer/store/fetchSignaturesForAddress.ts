import { ConfirmedSignatureInfo, Connection } from '@solana/web3.js'
import { selectorFamily } from 'recoil'
import solanaCluster from '../../../store/solanaCluster'
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

      // TODO: possibly use getConfirmedSignaturesForAddress2
      const signatures = await connection.getSignaturesForAddress(pubkey, {
        limit: 10,
      })

      return signatures
    },
})
