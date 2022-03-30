import { Connection, PublicKey, TokenAccountBalancePair } from '@solana/web3.js'
import { selectorFamily, useRecoilValue } from 'recoil'
import solanaCluster from '../../../store/solanaCluster'
import { pageIdx } from './pageIdx'

export type TokenAccountBalancePairWithOwner = TokenAccountBalancePair & {
  owner?: string
}

export const fetchLargestAccounts = selectorFamily<
  TokenAccountBalancePairWithOwner[],
  any
>({
  key: 'largestAccounts',
  get:
    (pubkey) =>
    async ({ get }) => {
      get(pageIdx) // bust this cache every page

      const { endpoint } = get(solanaCluster)

      const tokenLargestAccounts = (
        await new Connection(endpoint, 'confirmed').getTokenLargestAccounts(
          pubkey
        )
      ).value

      return await Promise.all(
        tokenLargestAccounts.map(
          async (account): Promise<TokenAccountBalancePairWithOwner> => {
            const accountInfo = (
              await new Connection(endpoint, 'confirmed').getParsedAccountInfo(
                account.address
              )
            ).value
            if (accountInfo && 'parsed' in accountInfo.data) {
              const owner = accountInfo.data.parsed.info.owner as any
              return {
                ...account,
                owner,
              }
            }
            return account
          }
        )
      )
    },
})

export const useLargestAccounts = (pubkey: PublicKey) =>
  useRecoilValue(fetchLargestAccounts(pubkey))
