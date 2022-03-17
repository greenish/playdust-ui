import { SearchFilterFields } from '../store'

export type FieldType = 'collection' | 'attribute' | 'text' | 'range'

export interface QueryId {
  id: string
  locked?: boolean
}

export interface CollectionContent {
  field: 'collection'
  value: string
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

export interface RangeContent {
  field: 'range'
  value: SearchFilterFields
  min: number
  max: number
}
export interface RangeQuery extends RangeContent, QueryId {}

export type OperationType = 'and' | 'or'
export type QueryContent =
  | CollectionContent
  | AttributeContent
  | TextContent
  | RangeContent
export type QueryType =
  | CollectionQuery
  | AttributeQuery
  | TextQuery
  | RangeQuery

type ComposedQueryType = QueryType[][]

export default ComposedQueryType
