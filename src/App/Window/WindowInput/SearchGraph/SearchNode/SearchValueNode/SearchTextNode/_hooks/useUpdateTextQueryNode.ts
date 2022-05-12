import updateQueryNode from '../../../../../../_helpers/updateQueryNode';
import makeUseQueryChange from '../../../../../../_hooks/makeUseQueryChange';

interface UseUpdateTextNodeInputType {
  id: string;
  text: string;
}

const useUpdateTextQueryNode = makeUseQueryChange<UseUpdateTextNodeInputType>(
  (query) =>
    ({ text, id }) => {
      const nextQuery = updateQueryNode(query, id, { value: text });

      return { query: nextQuery };
    }
);

export default useUpdateTextQueryNode;
