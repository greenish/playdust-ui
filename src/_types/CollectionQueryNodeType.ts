import { assign, Infer } from 'superstruct';
import CollectionQueryContentType from './CollectionQueryContentType';
import QueryNodeIdType from './QueryNodeIdType';

type CollectionQueryNodeType = Infer<typeof CollectionQueryNodeType>;
const CollectionQueryNodeType = assign(
  CollectionQueryContentType,
  QueryNodeIdType
);

export default CollectionQueryNodeType;
