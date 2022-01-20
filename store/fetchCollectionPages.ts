import collectionCursor from './collectionCursor'
import fetchCollection from './fetchCollection'
import {
  selector,
  waitForNone,
} from 'recoil'
import type {
  ParsedMetadata
} from '../solana/types'
import collectionIdentifier from './collectionIdentifier'

type FetchCollectionPageOutput = {
  initialized: boolean
  loading: boolean
  tokens: ParsedMetadata[]
  total: number
}

const PAGE_SIZE = 25

const defaultValue = {
  initialized: false,
  loading: true,
  tokens: [],
  total: 0
}

const fetchCollectionPages = selector<FetchCollectionPageOutput>({
  key: 'fetchCollectionPages',
  get: async ({ get }) => {
    const identifier = get(collectionIdentifier)

    if (!identifier) {
      return defaultValue
    }

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
      return defaultValue
    }

    const loading = !!pages.find(entry => entry.state === 'loading')
    const tokens = pages
      .filter(entry => entry.state === 'hasValue')
      .flatMap(entry => entry.contents.data)
    const total = pages.find(entry => entry.state === 'hasValue')?.contents?.total || 0

    return {
      initialized,
      loading,
      tokens,
      total,
    }
  }
})

export default fetchCollectionPages
