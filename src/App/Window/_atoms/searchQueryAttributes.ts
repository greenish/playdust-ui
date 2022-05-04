import { selector } from 'recoil'
import type AttributeQueryNodeType from '../../../_types/AttributeQueryNodeType'
import type QueryNodeType from '../../../_types/QueryNodeType'
import searchStateUncommitted from './searchStateUncommitted'

const isExactAttributeQuery = (
  query: QueryNodeType
): query is AttributeQueryNodeType =>
  'trait' in query && query.field === 'attribute'

const searchQueryAttributes = selector<AttributeQueryNodeType[]>({
  key: 'searchQueryAttributes',
  get: ({ get }) => {
    const { query } = get(searchStateUncommitted)

    const result = query.flat().filter(isExactAttributeQuery)

    return result
  },
})

export default searchQueryAttributes
