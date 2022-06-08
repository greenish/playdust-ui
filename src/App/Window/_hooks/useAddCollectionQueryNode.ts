import { nanoid } from 'nanoid';
import { useRecoilValue } from 'recoil';
import searchQueryActiveGroupIdxAtom from '../_atoms/searchQueryActiveGroupIdxAtom';
import searchQueryActiveNodeMetaAtom from '../_atoms/searchQueryActiveNodeMetaAtom';
import searchQueryRootNodeAtom from '../_atoms/searchQueryRootNodeAtom';
import searchStateAtom from '../_atoms/searchStateAtom';
import addQueryNode from '../_helpers/addQueryNode';
import initializeSearchQuery from '../_helpers/initializeSearchQuery';
import ChangeSearchQueryMethodType from '../_types/ChangeSearchQueryMethodType';
import CollectionQueryNodeType from '../_types/CollectionQueryNodeType';
import useChangeSearchQuery from './useChangeSearchQuery';

const useAddCollectionQueryNode = (method?: ChangeSearchQueryMethodType) => {
  const activeNodeMeta = useRecoilValue(searchQueryActiveNodeMetaAtom);
  const { query } = useRecoilValue(searchStateAtom);
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);
  const activeGroupIdx = useRecoilValue(searchQueryActiveGroupIdxAtom);
  const changeSearchQuery = useChangeSearchQuery(method);

  return (collectionId: string, initialize?: boolean) =>
    changeSearchQuery(() => {
      const newNode: CollectionQueryNodeType = {
        id: nanoid(),
        type: 'query',
        field: 'collection',
        value: collectionId,
      };

      if (!rootNode || initialize) {
        return { query: initializeSearchQuery(newNode) };
      }

      if (activeNodeMeta?.type === 'group') {
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

export default useAddCollectionQueryNode;
