import { Infer, literal, number, type } from 'superstruct';
import SearchFilterUnionType from './SearchFilterUnionType';

type RangeQueryContentType = Infer<typeof RangeQueryContentType>;
const RangeQueryContentType = type({
  field: literal('range'),
  value: SearchFilterUnionType,
  min: number(),
  max: number(),
});

export default RangeQueryContentType;
