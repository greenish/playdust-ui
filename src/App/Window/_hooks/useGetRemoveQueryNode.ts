import { useRecoilValue } from 'recoil';
import searchQueryParentIdMapAtom from '../WindowInput/_atoms/searchQueryParentIdMapAtom';
import searchStateAtom from '../_atoms/searchStateAtom';
import SearchQueryType from '../_types/SearchQueryType';
import SearchStateType from '../_types/SearchStateType';
import useGetUpdateSearchQuery from './useGetUpdateSearchQuery';

const useGetRemoveQueryNode = () => {
  const { query } = useRecoilValue(searchStateAtom);
  const getUpdateSearchQuery = useGetUpdateSearchQuery();
  const parentMap = useRecoilValue(searchQueryParentIdMapAtom);

  const remove = (removalId: string, uncommittedQuery?: SearchQueryType) =>
    getUpdateSearchQuery(
      (node) => {
        if (node.id === removalId) {
          return null;
        }

        if (node.type === 'group' && node.children.includes(removalId)) {
          return {
            ...node,
            children: node.children.filter((child) => child !== removalId),
          };
        }

        return node;
      },
      [],
      uncommittedQuery
    );

  return (removalId: string): Pick<SearchStateType, 'query'> => {
    const parentId = parentMap[removalId];
    const parentNode = parentId && query.nodes[parentId];
    const shouldRemoveGroup =
      parentNode &&
      parentNode.type === 'group' &&
      parentNode.children.length <= 1;

    const removed = remove(removalId);

    if (shouldRemoveGroup) {
      return remove(parentId, removed.query);
    }

    return removed;
  };
};

export default useGetRemoveQueryNode;
