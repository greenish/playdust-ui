import type SearchSortType from '../../../../../../../_types/SearchSortUnionType';
import makeUseQueryChange from '../../../../../_hooks/makeUseQueryChange';

const useSetSortValue = makeUseQueryChange<SearchSortType>(() => (nextSort) => {
  if (nextSort.field === 'list-price') {
    return { sort: nextSort, onlyListed: true };
  }

  return { sort: nextSort };
});

export default useSetSortValue;
