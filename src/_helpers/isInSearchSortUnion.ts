import type SearchSortUnionType from '../_types/SearchSortUnionType';
import allSortDirections from './allSortDirections';
import allSortFields from './allSortFields';

const isInSearchSortUnion = (
  value: SearchSortUnionType
): value is SearchSortUnionType =>
  allSortFields.includes(value.field) &&
  allSortDirections.includes(
    value.direction
  );

export default isInSearchSortUnion;
