import makeUseQueryChange from '../_helpers/makeUseQueryChange';
import removeQueryNode from '../_helpers/removeQueryNode';

const useRemoveQueryNode = makeUseQueryChange<string>(
  (query) => (id: string) => {
    const nextQuery = removeQueryNode(query, id);

    return { query: nextQuery };
  }
);

export default useRemoveQueryNode;
