import removeQueryNode from '../_helpers/removeQueryNode';
import makeUseQueryChange from './makeUseQueryChange';

const useRemoveQueryNode = makeUseQueryChange<string>(
  (query) => (id: string) => {
    const nextQuery = removeQueryNode(query, id);

    return { query: nextQuery };
  }
);

export default useRemoveQueryNode;
