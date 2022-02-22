import SearchMetadata from '../types/SearchMetadata'
import api from './api'

export interface SearchResponse {
  results: SearchMetadata[]
  attributes: {
    trait: string
    options: string[]
  }[]
}

const fetchSearch = async (
  query: {
    field: string
    searchType: string
    value?: string | string[] | object
    trait?: string
  }[][],
  resultSize?: number,
  aggSize?: number,
  aggOptionSize?: number
) => {
  const normalizedQuery = query.map((parent) =>
    parent.flatMap((child) => {
      const values = Array.isArray(child.value) ? child.value : [child.value]

      return values.map((value) => ({
        trait: child.trait,
        field: child.field,
        searchType: child.searchType,
        value,
      }))
    })
  )

  const { data } = await api.post<SearchResponse>('/search', {
    query: normalizedQuery,
    resultSize,
    aggSize,
    aggOptionSize,
  })

  return data
}

export default fetchSearch
