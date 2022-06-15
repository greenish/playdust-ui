import { useRecoilValue } from 'recoil';
import shortId from '../../../_helpers/shortId';
import searchQueryRootNodeAtom from '../../_atoms/searchQueryRootNodeAtom';
import makeUseChangeSearchQuery from '../../_hooks/makeUseChangeSearchQuery';
import useGetAddQueryNode from '../../_hooks/useGetAddQueryNode';
import useGetRemoveQueryNode from '../../_hooks/useGetRemoveQueryNode';
import useGetUpdateSearchQuery from '../../_hooks/useGetUpdateSearchQuery';
import AttributeQueryNodeType from '../../_types/AttributeQueryNodeType';
import GroupNodeType from '../../_types/GroupNodeType';
import findTopLevelAttributeAtom from '../_atoms/findTopLevelAttributeAtom';
import findTopLevelAttributeKeyAtom from '../_atoms/findTopLevelAttributeKeyAtom';
import useGetAddTopLevelQueryNode from './useGetAddTopLevelQueryNode';

const useToggleTopLevelAttributeNode = makeUseChangeSearchQuery(() => {
  const addTopLevelNode = useGetAddTopLevelQueryNode();
  const getRemoveNode = useGetRemoveQueryNode();
  const findAttribute = useRecoilValue(findTopLevelAttributeAtom);
  const findAttributeKey = useRecoilValue(findTopLevelAttributeKeyAtom);
  const getAddQueryNode = useGetAddQueryNode();
  const updateSearchQuery = useGetUpdateSearchQuery();
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);

  return (key: string, value: string) => {
    const found = findAttribute(key, value);

    if (found) {
      return getRemoveNode(found.id);
    }

    const newNode: AttributeQueryNodeType = {
      id: shortId(),
      type: 'query',
      field: 'attribute',
      key,
      value,
    };
    const foundKey = findAttributeKey(key);

    if (foundKey?.groupId) {
      return getAddQueryNode(newNode, foundKey.groupId);
    }

    if (foundKey?.nodeId && rootNode) {
      const orWrapper: GroupNodeType = {
        id: shortId(),
        type: 'group',
        operator: 'or',
        children: [foundKey.nodeId, newNode.id],
      };

      return updateSearchQuery(
        (node) => {
          if (node.id === rootNode.id) {
            return {
              ...rootNode,
              children: rootNode.children.map((childId) =>
                childId === foundKey.nodeId ? orWrapper.id : childId
              ),
            };
          }

          return node;
        },
        [orWrapper, newNode]
      );
    }

    return addTopLevelNode(newNode);
  };
});

export default useToggleTopLevelAttributeNode;
