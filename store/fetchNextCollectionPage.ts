import collectionCursor from './collectionCursor'
import fetchCollection from './fetchCollection'
import {
  selectorFamily,
  waitForNone,
} from 'recoil'
import type {
  MetaplexCollectionIdentifier,
  ParsedMetadata
} from '../solana/types'

type FetchCollectionPageOutput = {
  initialized: boolean
  loading: boolean
  count: number
  tokens: ParsedMetadata[]
}

const PAGE_SIZE = 25

const fetchNextCollectionPage = selectorFamily<
  FetchCollectionPageOutput,
  MetaplexCollectionIdentifier
>({
  key: 'fetchNextCollectionPage',
  get: identifier =>
    async ({ get }) => {
      const cursor = get(collectionCursor)
      const cursorRange = Array.from(Array(cursor).keys())

      const pages = get(waitForNone(
        cursorRange.map(entry => fetchCollection({
          identifier,
          start: entry * PAGE_SIZE,
          stop: (entry + 1) * PAGE_SIZE,
        }))
      ))

      const initialized = !!pages.find(entry => entry.state === 'hasValue')

      if (!initialized) {
        return {
          initialized,
          loading: true,
          tokens: [],
          count: 0,
        }
      }

      const loading = !!pages.find(entry => entry.state === 'loading')

      const hasValue = pages
        .filter(entry => entry.state === 'hasValue')

      const tokens = hasValue
        .flatMap(entry => entry.contents.tokens)

      return {
        initialized,
        loading,
        tokens,
        count: hasValue[0].contents.count,
      }
    }
})

export default fetchNextCollectionPage
