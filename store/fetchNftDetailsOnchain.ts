import { selectorFamily } from 'recoil'
import * as solana from '../solana'
import type { ParsedMetadata } from '../solana/types'

const fetchNftDetailsOnchain = selectorFamily<ParsedMetadata, string>({
  key: 'fetchNftDetailsOnchain',
  get: (mint: string) => async () => {
    const dape = await solana.fetchOffchain('/data/DAPE.json')
    const auror = await solana.fetchOffchain('/data/AUROR.json')
    const shark = await solana.fetchOffchain('/data/SHARK.json')
    const ssc = await solana.fetchOffchain('/data/SSC.json')

    const all = [...dape, ...auror, ...shark, ...ssc]

    return all.find((e) => e.mint === mint)
  },
})

export default fetchNftDetailsOnchain
