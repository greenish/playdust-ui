import { MetaplexCollectionIdentifier } from '../../../solana/types'

export type FieldType = 'collection' | 'attribute' | 'text'

export interface QueryId {
  id: string
  locked?: boolean
}

interface CollectionContent {
  field: 'collection'
  value: MetaplexCollectionIdentifier
}
export interface CollectionQuery extends CollectionContent, QueryId {}

export interface AttributeContent {
  field: 'attribute'
  value: string[]
  trait: string
}
export interface AttributeQuery extends AttributeContent, QueryId {}

interface TextContent {
  field: 'text'
  value: string
}
export interface TextQuery extends TextContent, QueryId {}

export type OperationType = 'and' | 'or'
export type QueryContent = CollectionContent | AttributeContent | TextContent
export type QueryType = CollectionQuery | AttributeQuery | TextQuery

type ComposedQueryType = QueryType[][]

export default ComposedQueryType
