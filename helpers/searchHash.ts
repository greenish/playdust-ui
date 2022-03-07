import qs from 'qs'
import { MetaplexCollectionIdentifier } from '../solana/types'
import ComposedQueryType from '../types/ComposedQueryType'

export const parseHash = (): any => {
  try {
    const params = window.location.hash.slice(1)
    const parsed = qs.parse(params) as any
    const parsedQuery = Object.values(qs.parse(parsed.query)) as any[][]
    const result = { query: parsedQuery, sortIdx: parseInt(parsed.sortIdx) }

    return result
  } catch {
    return {}
  }
}

export const isHashEmpty = (): boolean => {
  const hash = window.location.hash

  return hash.length === 0
}

export const stringifyHash = (
  searchQueryValid: ComposedQueryType,
  selectedIndex = 0
) => {
  const withoutIds = searchQueryValid.map((parent) =>
    parent.map(({ id, ...rest }) => rest)
  )
  const stringified = qs.stringify({
    query: withoutIds,
    sortIdx: selectedIndex,
  })

  return stringified
}

export const getCollectionHash = (
  collectionValue: MetaplexCollectionIdentifier
) => {
  const seed: any[][] = [
    [
      {
        field: 'collection',
        searchType: 'exact',
        value: collectionValue,
        locked: true,
      },
    ],
  ]

  return stringifyHash(seed)
}
