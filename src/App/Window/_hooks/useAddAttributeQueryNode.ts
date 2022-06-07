import { nanoid } from 'nanoid';
import { useRecoilValue } from 'recoil';
import searchQueryActiveGroupIdxAtom from '../_atoms/searchQueryActiveGroupIdxAtom';
import searchQueryActiveNodeMetaAtom from '../_atoms/searchQueryActiveNodeMetaAtom';
import searchStateAtom from '../_atoms/searchStateAtom';
import addQueryNode from '../_helpers/addQueryNode';
import AttributeQueryNodeType from '../_types/AttributeQueryNodeType';
import useChangeSearchQuery from './useChangeSearchQuery';

const useAddAttributeQueryNode = () => {
  const { query } = useRecoilValue(searchStateAtom);
  const activeNodeMeta = useRecoilValue(searchQueryActiveNodeMetaAtom);
  const activeGroupId = useRecoilValue(searchQueryActiveGroupIdxAtom);
  const changeSearchQuery = useChangeSearchQuery();

  return (key: string, value: string) => {
    if (activeNodeMeta) {
      const queryAddition: AttributeQueryNodeType = {
        id: nanoid(),
        type: 'query',
        field: 'attribute',
        value,
        key,
      };
      const parentId = activeNodeMeta.nodeId;

      const next = addQueryNode(query, queryAddition, parentId, activeGroupId);

      return changeSearchQuery({ query: next });
    }
  };
};

export default useAddAttributeQueryNode;
