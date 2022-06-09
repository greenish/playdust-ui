import { nanoid } from 'nanoid';
import { useRecoilValue } from 'recoil';
import searchQueryRootNodeAtom from '../../../../../_atoms/searchQueryRootNodeAtom';
import searchStateAtom from '../../../../../_atoms/searchStateAtom';
import makeUseChangeSearchQuery from '../../../../../_hooks/makeUseChangeSearchQuery';
import useGetAddQueryNode from '../../../../../_hooks/useGetAddQueryNode';
import QueryNodeType from '../../../../../_types/QueryNodeType';
import SearchQueryType from '../../../../../_types/SearchQueryType';

const useAddTopLevelQueryNode = makeUseChangeSearchQuery(() => {
  const { query } = useRecoilValue(searchStateAtom);
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);
  const getAddQuerynode = useGetAddQueryNode();

  return (newNode: QueryNodeType) => {
    if (rootNode) {
      if (rootNode.operator === 'and') {
        return getAddQuerynode(newNode, rootNode.id, rootNode.children.length);
      }

      const andWrapperId = nanoid();

      const nextQuery: SearchQueryType = {
        rootId: andWrapperId,
        nodes: {
          [andWrapperId]: {
            id: andWrapperId,
            type: 'group',
            operator: 'and',
            children: [rootNode.id, newNode.id],
          },
          [newNode.id]: newNode,
          ...query.nodes,
        },
      };

      return { query: nextQuery };
    }
  };
});

export default useAddTopLevelQueryNode;
