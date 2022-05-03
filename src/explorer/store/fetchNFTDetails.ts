import { PublicKey } from '@solana/web3.js'
import { selectorFamily, useRecoilValue } from 'recoil'
import * as solana from '../../../solana'
import solanaCluster from '../../App/_atoms/solanaCluster'
import api from '../../App/_helpers/frontendApi'
import type SearchMetadata from '../../App/_types/SearchMetadataType'

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

        const { endpoint } = get(solanaCluster)

        return solana.fetchOnchain.byMintAddress(endpoint, mint)
      } catch (e) {
        console.error(e)
      }
    },
})

export const useNFTDetails = (pubkey: PublicKey) =>
  useRecoilValue(fetchNFTDetails(pubkey.toBase58()))
