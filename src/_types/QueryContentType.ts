import { Infer, union } from 'superstruct';
import AttributeQueryContentType from './AttributeQueryContentType';
import CollectionQueryContentType from './CollectionQueryContentType';
import RangeQueryContentType from './RangeQueryContentType';
import TextQueryContentType from './TextQueryContentType';

type QueryContentType = Infer<typeof QueryContentType>;
const QueryContentType = union([
  CollectionQueryContentType,
  AttributeQueryContentType,
  TextQueryContentType,
  RangeQueryContentType,
]);

export default QueryContentType;
