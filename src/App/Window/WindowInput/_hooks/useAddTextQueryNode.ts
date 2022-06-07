import { nanoid } from 'nanoid';
import { useRecoilValue } from 'recoil';
import searchQueryActiveGroupIdxAtom from '../../_atoms/searchQueryActiveGroupIdxAtom';
import searchQueryActiveNodeMetaAtom from '../../_atoms/searchQueryActiveNodeMetaAtom';
import searchQueryRootNodeAtom from '../../_atoms/searchQueryRootNodeAtom';
import searchQueryTermAtom from '../../_atoms/searchQueryTermAtom';
import searchStateAtom from '../../_atoms/searchStateAtom';
import addQueryNode from '../../_helpers/addQueryNode';
import initializeSearchQuery from '../../_helpers/initializeSearchQuery';
import useChangeSearchQuery from '../../_hooks/useChangeSearchQuery';
import type SearchSortType from '../../_types/SearchSortType';
import TextQueryNodeType from '../../_types/TextQueryNodeType';

const useAddTextQueryNode = () => {
  const changeSearchQuery = useChangeSearchQuery();
  const { query } = useRecoilValue(searchStateAtom);
  const activeNodeMeta = useRecoilValue(searchQueryActiveNodeMetaAtom);
  const searchTerm = useRecoilValue(searchQueryTermAtom);
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);
  const activeGroupIdx = useRecoilValue(searchQueryActiveGroupIdxAtom);

  return () => {
    changeSearchQuery(() => {
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
        const nextQuery = addQueryNode(
          query,
          newNode,
          activeNodeMeta.nodeId,
          activeGroupIdx
        );

        return { query: nextQuery };
      }

      return null;
    });
  };
};

export default useAddTextQueryNode;
