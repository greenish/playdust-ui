import AttributeQueryContentType from './AttributeQueryContentType';
import CollectionQueryContentType from './CollectionQueryContentType';
import RangeQueryContentType from './RangeQueryContentType';
import TextQueryContentType from './TextQueryContentType';

type QueryContentType =
  | CollectionQueryContentType
  | AttributeQueryContentType
  | TextQueryContentType
  | RangeQueryContentType;

export default QueryContentType;
