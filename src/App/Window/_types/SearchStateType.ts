import type ComposedQueryType from '../../../_types/ComposedQueryType';
import type SearchSortType from '../../../_types/SearchSortUnionType';

interface SearchStateType {
  query: ComposedQueryType;
  sort?: SearchSortType;
  onlyListed?: boolean;
}

export default SearchStateType;
