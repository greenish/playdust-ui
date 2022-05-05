import SearchFilterUnionType from './SearchFilterUnionType';

interface RangeQueryContentType {
  field: 'range';
  value: SearchFilterUnionType;
  min: number;
  max: number;
}

export default RangeQueryContentType;
