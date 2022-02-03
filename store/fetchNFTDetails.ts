import { selectorFamily } from 'recoil'
import api from '../helpers/api'
import * as solana from '../solana'
import type OpenSearchSource from '../types/OpenSearchSource'
import solanaCluster from './solanaCluster'

const fetchNFTDetails = selectorFamily<OpenSearchSource | undefined, string>({
  key: 'fetchNFTDetails',
  get:
    (mint: string) =>
    async ({ get }) => {
      try {
        const { data } = await api.get<OpenSearchSource>(`/nfts/${mint}`)

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
