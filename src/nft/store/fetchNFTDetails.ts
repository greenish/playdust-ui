import { selectorFamily } from 'recoil'
import * as solana from '../../../solana'
import { solanaCluster } from '../../app/store'
import api from '../../common/helpers/frontendApi'
import type SearchMetadata from '../../common/types/SearchMetadata'

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
