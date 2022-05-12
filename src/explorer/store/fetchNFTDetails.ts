import { PublicKey } from '@solana/web3.js'
import { selectorFamily, useRecoilValue } from 'recoil'
import * as solana from '../../../solana'
import solanaClusterAtom from '../../App/_atoms/solanaClusterAtom'
import api from '../../App/Window/_helpers/frontendApi'
import type SearchMetadata from '../../../solana/SearchMetadataType'

export const fetchNFTDetails = selectorFamily<
  SearchMetadata | undefined,
  string
>({
  key: 'fetchNFTDetails',
  get:
    (mint: string) =>
    async ({ get }) => {
      try {
        const { data } = await api.get<SearchMetadata>(`/mint?address=${mint}`)

        if (0 && data) {
          return data
        }

        const { endpoint } = get(solanaClusterAtom)

        return solana.fetchOnchain.byMintAddress(endpoint, mint)
      } catch (e) {
        console.error(e)
      }
    },
})

export const useNFTDetails = (pubkey: PublicKey) =>
  useRecoilValue(fetchNFTDetails(pubkey.toBase58()))
