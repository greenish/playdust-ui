import AttributeQueryNodeType from './AttributeQueryNodeType';
import CollectionQueryNodeType from './CollectionQueryNodeType';
import RangeQueryNodeType from './RangeQueryNodeType';
import TextQueryNodeType from './TextQueryNodeType';

export type OperationType = 'and' | 'or';

type QueryNodeType =
  | CollectionQueryNodeType
  | AttributeQueryNodeType
  | TextQueryNodeType
  | RangeQueryNodeType;

export default QueryNodeType;
