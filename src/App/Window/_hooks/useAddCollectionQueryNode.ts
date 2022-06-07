import { nanoid } from 'nanoid';
import { useRecoilValue } from 'recoil';
import searchQueryActiveNodeMetaAtom from '../_atoms/searchQueryActiveNodeMetaAtom';
import searchQueryRootNodeAtom from '../_atoms/searchQueryRootNodeAtom';
import initializeSearchQuery from '../_helpers/initializeSearchQuery';
import CollectionQueryNodeType from '../_types/CollectionQueryNodeType';
import makeUseChangeSearchQuery from './makeUseChangeSearchQuery';
import useGetAddQueryNode from './useGetAddQueryNode';

const useAddCollectionQueryNode = makeUseChangeSearchQuery(() => {
  const activeNodeMeta = useRecoilValue(searchQueryActiveNodeMetaAtom);
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);
  const getAddQueryNode = useGetAddQueryNode();

  return (collectionId: string, initialize?: boolean) => {
    const newNode: CollectionQueryNodeType = {
      id: nanoid(),
      type: 'query',
      field: 'collection',
      value: collectionId,
    };

    if (!rootNode || initialize) {
      const nextQuery = initializeSearchQuery(newNode);

      return { query: nextQuery };
    }

    if (activeNodeMeta?.type === 'group') {
      return getAddQueryNode(newNode, activeNodeMeta.nodeId);
    }
  };
});

export default useAddCollectionQueryNode;
