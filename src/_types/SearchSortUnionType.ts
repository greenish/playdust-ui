import allSortDirections from '../_helpers/allSortDirections';
import allSortFields from '../_helpers/allSortFields';

type SortTuple = typeof allSortFields;
type SortField = SortTuple[number];

type DirectionTuple = typeof allSortDirections;
type SortDirection = DirectionTuple[number];

interface SearchSortUnionType {
  field: SortField;
  direction: SortDirection;
}

export default SearchSortUnionType;
