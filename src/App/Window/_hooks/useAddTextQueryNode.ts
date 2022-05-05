import type SearchSortType from '../../../_types/SearchSortType';
import addQueryNode from '../_helpers/addQueryNode';
import makeUseQueryChange from '../_helpers/makeUseQueryChange';
import type QueryNodeAdditionType from '../_types/QueryNodeAdditionType';

const useAddTextQueryNode = makeUseQueryChange<string>((query) => (text) => {
  const queryAddition: QueryNodeAdditionType = {
    content: {
      field: 'text',
      value: text,
    },
    operation: 'and',
  };
  const sort: SearchSortType = {
    field: 'relevance',
    direction: 'desc',
  };

  const nextQuery = addQueryNode(query, queryAddition);

  return { query: nextQuery, sort };
});

export default useAddTextQueryNode;
