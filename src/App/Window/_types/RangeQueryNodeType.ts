import { assign, Infer, literal, number, type } from 'superstruct';
import QueryNodeIdType from './QueryNodeBaseType';
import SearchFilterUnionType from './SearchFilterUnionType';

type RangeQueryNodeType = Infer<typeof RangeQueryNodeType>;
const RangeQueryNodeType = assign(
  type({
    field: literal('range'),
    value: SearchFilterUnionType,
    min: number(),
    max: number(),
  }),
  QueryNodeIdType
);

export default RangeQueryNodeType;
