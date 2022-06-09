import { useRecoilValue } from 'recoil';
import searchQueryActiveGroupIdxAtom from '../_atoms/searchQueryActiveGroupIdxAtom';
import searchStateAtom from '../_atoms/searchStateAtom';
import insertAtIdx from '../_helpers/insertAtIdx';
import SearchQueryNodeType from '../_types/SearchQueryNodeType';
import SearchStateType from '../_types/SearchStateType';
import useGetUpdateSearchQuery from './useGetUpdateSearchQuery';

const useGetAddQueryNode = () => {
  const { query } = useRecoilValue(searchStateAtom);
  const activeGroupIdx = useRecoilValue(searchQueryActiveGroupIdxAtom);
  const getUpdateSearchQuery = useGetUpdateSearchQuery();

  return (
    nodeAddition: SearchQueryNodeType,
    parentId: string,
    index?: number
  ): Pick<SearchStateType, 'query'> => {
    const normalizedIdx = index || activeGroupIdx;

    if (normalizedIdx < 0) {
      return { query };
    }

    const updated = getUpdateSearchQuery((node) => {
      if (node.id === parentId && node.type === 'group') {
        return {
          ...node,
          children: insertAtIdx(node.children, nodeAddition.id, normalizedIdx),
        };
      }

      return node;
    }, nodeAddition);

    return updated;
  };
};

export default useGetAddQueryNode;
