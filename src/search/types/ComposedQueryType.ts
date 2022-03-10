export type FieldType = 'collection' | 'attribute' | 'text'

export interface QueryId {
  id: string
  locked?: boolean
}

export interface CollectionContent {
  field: 'collection'
  value: {
    id: string
    name: string
  }
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
