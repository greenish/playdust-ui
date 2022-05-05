import type SearchSortType from '../../../_types/SearchSortType';
import makeUseQueryChange from '../_helpers/makeUseQueryChange';

const useSetSortValue = makeUseQueryChange<SearchSortType>(() => (nextSort) => {
  if (nextSort.field === 'list-price') {
    return { sort: nextSort, onlyListed: true };
  }

  return { sort: nextSort };
});

export default useSetSortValue;
