import { useRecoilValue } from 'recoil';
import shortId from '../../../../../../_helpers/shortId';
import makeUseChangeSearchQuery from '../../../../../_hooks/makeUseChangeSearchQuery';
import useGetRemoveQueryNode from '../../../../../_hooks/useGetRemoveQueryNode';
import findTopLevelSearchQueryAttributeAtom from '../_atoms/findTopLevelSearchQueryAttributeAtom';
import useGetAddTopLevelQueryNode from './useGetAddTopLevelQueryNode';

const useToggleTopLevelAttributeNode = makeUseChangeSearchQuery(() => {
  const addTopLevelNode = useGetAddTopLevelQueryNode();
  const getRemoveNode = useGetRemoveQueryNode();
  const findAttribute = useRecoilValue(findTopLevelSearchQueryAttributeAtom);

  return (key: string, value: string) => {
    const found = findAttribute(key, value);

    if (found) {
      return getRemoveNode(found.id);
    }

    return addTopLevelNode({
      id: shortId(),
      type: 'query',
      field: 'attribute',
      key,
      value,
    });
  };
});

export default useToggleTopLevelAttributeNode;
