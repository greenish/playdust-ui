import {
  ConfirmedSignatureInfo,
  Connection,
  PublicKey,
  TransactionSignature,
} from '@solana/web3.js'
import { selectorFamily } from 'recoil'
import solanaClusterAtom from '../../App/_atoms/solanaClusterAtom'
import { pageIdx } from './pageIdx'

export const fetchSignaturesForAddress = async (
  endpoint: string,
  pubkey: PublicKey,
  before?: TransactionSignature
) => {
  const connection = new Connection(endpoint)

  const signatures = await connection.getConfirmedSignaturesForAddress2(
    pubkey,
    {
      before,
      limit: 10,
    }
  )

  return signatures
}

export const fetchSignaturesForAddressSelector = selectorFamily<
  ConfirmedSignatureInfo[],
  any
>({
  key: 'signaturesForAddress',
  get:
    (pubkey) =>
    async ({ get }) => {
      get(pageIdx) // bust this cache every page

      const { endpoint } = get(solanaClusterAtom)

      return fetchSignaturesForAddress(endpoint, pubkey)
    },
})
