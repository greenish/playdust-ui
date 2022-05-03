import {
  AccountInfo,
  Connection,
  ParsedAccountData,
  PublicKey,
} from '@solana/web3.js'
import { selectorFamily, useRecoilValue } from 'recoil'
import solanaCluster from '../../App/_atoms/solanaCluster'
import { pageIdx } from './pageIdx'

export const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
)

export const fetchParsedTokenAccountsByOwner = selectorFamily<
  { pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }[],
  any
>({
  key: 'parsedTokenAccountsByOwner',
  get:
    (pubkey) =>
    async ({ get }) => {
      get(pageIdx) // bust this cache every page

      const { endpoint } = get(solanaCluster)
      const connection = new Connection(endpoint, 'processed')

      let resp = await connection.getParsedTokenAccountsByOwner(pubkey, {
        programId: TOKEN_PROGRAM_ID,
      })

      const tokens = resp.value

      return tokens
    },
})

export const useParsedTokenAccountsByOwner = (pubkey: PublicKey) =>
  useRecoilValue(fetchParsedTokenAccountsByOwner(pubkey))
