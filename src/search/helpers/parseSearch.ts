import { nanoid } from 'nanoid'
import * as store from '../store'
import ComposedQueryType from '../types/ComposedQueryType'
import SearchSort, { isSearchSort } from '../types/SearchSort'
import SearchState from '../types/SearchState'

const parseQuery = (nextState: any): ComposedQueryType | never => {
  const isValid = nextState.flat().every(store.queryValidationPredicate)
  const query = nextState as ComposedQueryType
  const cleaned = query.map((parent) =>
    parent.map((child) => ({
      ...child,
      id: nanoid(),
    }))
  )

  if (!isValid) {
    throw new Error('Unable to parse search query')
  }

  return cleaned
}

const parseOnlyListed = (onlyListed: unknown) => {
  try {
    if (typeof onlyListed == 'boolean') {
      return onlyListed
    }

    return undefined
  } catch {
    return undefined
  }
}

const parseSort = (sort: SearchSort) => {
  try {
    return isSearchSort(sort) ? sort : undefined
  } catch {
    return undefined
  }
}

const parseSearch = (input: string): SearchState => {
  const { query, onlyListed, sort } = JSON.parse(input)

  const parsedQuery = parseQuery(query)
  const parsedOnlyListed = parseOnlyListed(onlyListed)
  const parsedSort = parseSort(sort)

  return {
    query: parsedQuery,
    onlyListed: parsedOnlyListed,
    sort: parsedSort,
  }
}

export default parseSearch
