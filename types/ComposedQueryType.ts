import { MetaplexCollectionIdentifier } from '../solana/types'

export type FieldType = 'collection' | 'attribute' | 'updateAuthority'
export type SearchType = 'exact' | 'relevance'

export interface QueryId {
  id: string
  locked?: boolean
}

interface ExactCollectionContent {
  field: 'collection'
  searchType: 'exact'
  value: MetaplexCollectionIdentifier
}
export interface ExactCollectionQuery extends ExactCollectionContent, QueryId {}

export interface ExactAttributeContent {
  field: 'attribute'
  searchType: 'exact'
  value: string[]
  trait: string
}
export interface ExactAttributeQuery extends ExactAttributeContent, QueryId {}

interface RelevanceContent {
  field: string
  searchType: 'relevance'
  value: string
  relevance: number
}
interface RelevanceQuery extends RelevanceContent, QueryId {}

export type OperationType = 'and' | 'or'
export type QueryContent =
  | ExactCollectionContent
  | ExactAttributeContent
  | RelevanceContent
export type QueryType =
  | ExactCollectionQuery
  | ExactAttributeQuery
  | RelevanceQuery

type ComposedQueryType = QueryType[][]

export default ComposedQueryType
