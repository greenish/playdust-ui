import { assign, Infer } from 'superstruct';
import QueryNodeIdType from './QueryNodeIdType';
import RangeQueryContentType from './RangeQueryContentType';

type RangeQueryNodeType = Infer<typeof RangeQueryNodeType>;
const RangeQueryNodeType = assign(RangeQueryContentType, QueryNodeIdType);

export default RangeQueryNodeType;
