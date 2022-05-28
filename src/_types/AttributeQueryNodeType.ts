import { assign, Infer } from 'superstruct';
import AttributeQueryContentType from './AttributeQueryContentType';
import QueryNodeIdType from './QueryNodeIdType';

type AttributeQueryNodeType = Infer<typeof AttributeQueryNodeType>;
const AttributeQueryNodeType = assign(
  AttributeQueryContentType,
  QueryNodeIdType
);

export default AttributeQueryNodeType;
