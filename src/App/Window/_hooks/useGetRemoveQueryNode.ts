import { useRecoilValue } from 'recoil';
import searchQueryParentIdMapAtom from '../_atoms/searchQueryParentIdMapAtom';
import searchStateAtom from '../_atoms/searchStateAtom';
import SearchQueryType from '../_types/SearchQueryType';
import SearchStateType from '../_types/SearchStateType';
import useGetUpdateSearchQuery from './useGetUpdateSearchQuery';

type RemovalReturnType = Pick<SearchStateType, 'query'>;

const useGetRemoveQueryNode = () => {
  const searchState = useRecoilValue(searchStateAtom);
  const getUpdateSearchQuery = useGetUpdateSearchQuery();
  const parentMap = useRecoilValue(searchQueryParentIdMapAtom);

  const remove = (removalId: string, query: SearchQueryType) =>
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
      query
    );

  return (removalIds: string | string[]): RemovalReturnType => {
    const ids = typeof removalIds === 'string' ? [removalIds] : removalIds;

    return ids.reduce<RemovalReturnType>((acc, removalId) => {
      const parentId = parentMap[removalId];
      const parentNode = parentId && acc.query.nodes[parentId];
      const shouldRemoveGroup =
        parentNode &&
        parentNode.type === 'group' &&
        parentNode.children.length <= 1;

      const removed = remove(removalId, acc.query);

      if (shouldRemoveGroup) {
        return remove(parentId, removed.query);
      }

      return removed;
    }, searchState);
  };
};

export default useGetRemoveQueryNode;
