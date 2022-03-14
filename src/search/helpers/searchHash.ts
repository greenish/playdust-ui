import qs from 'qs'
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
  const hash = qs.parse(window.location.hash.slice(1))

  return !('query' in hash)
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

export const getCollectionHash = (collectionId: string) => {
  const seed: any[][] = [
    [
      {
        field: 'collection',
        value: collectionId,
      },
    ],
  ]

  return stringifyHash(seed)
}
