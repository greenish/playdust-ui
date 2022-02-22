import { selectorFamily } from 'recoil'
import api from '../helpers/api'
import * as solana from '../solana'
import type SearchMetadata from '../types/SearchMetadata'
import solanaCluster from './solanaCluster'

const fetchNFTDetails = selectorFamily<SearchMetadata | undefined, string>({
  key: 'fetchNFTDetails',
  get:
    (mint: string) =>
    async ({ get }) => {
      try {
        const { data } = await api.get<SearchMetadata>(`/nfts/${mint}`)

        if (data) {
          return data
        }

        const { endpoint } = get(solanaCluster)

        return solana.fetchOnchain.byMintAddress(endpoint, mint)
      } catch (e) {
        console.error(e)
      }
    },
})

export default fetchNFTDetails
