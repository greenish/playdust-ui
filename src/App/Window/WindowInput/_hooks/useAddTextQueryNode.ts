import { nanoid } from 'nanoid';
import { useRecoilValue } from 'recoil';
import searchQueryActiveNodeMetaAtom from '../../_atoms/searchQueryActiveNodeMetaAtom';
import searchQueryRootNodeAtom from '../../_atoms/searchQueryRootNodeAtom';
import initializeSearchQuery from '../../_helpers/initializeSearchQuery';
import makeUseChangeSearchQuery from '../../_hooks/makeUseChangeSearchQuery';
import useGetAddQueryNode from '../../_hooks/useGetAddQueryNode';
import type SearchSortType from '../../_types/SearchSortType';
import TextQueryNodeType from '../../_types/TextQueryNodeType';
import searchQueryTermAtom from '../_atoms/searchQueryTermAtom';

const useAddTextQueryNode = makeUseChangeSearchQuery(() => {
  const activeNodeMeta = useRecoilValue(searchQueryActiveNodeMetaAtom);
  const searchTerm = useRecoilValue(searchQueryTermAtom);
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);
  const getAddQueryNode = useGetAddQueryNode();

  return () => {
    const newNode: TextQueryNodeType = {
      id: nanoid(),
      type: 'query',
      field: 'text',
      value: searchTerm,
    };
    const sort: SearchSortType = {
      field: 'relevance',
      direction: 'desc',
    };

    if (!rootNode) {
      return {
        query: initializeSearchQuery(newNode),
        sort,
      };
    }

    if (activeNodeMeta && activeNodeMeta.type === 'group') {
      return getAddQueryNode(newNode, activeNodeMeta.nodeId);
    }
  };
});

export default useAddTextQueryNode;
