import { useRecoilValue } from 'recoil';
import makeUseChangeSearchQuery from '../../_hooks/makeUseChangeSearchQuery';
import useGetRemoveQueryNode from '../../_hooks/useGetRemoveQueryNode';
import searchQuerySelectedNodesAtom from '../_atoms/searchQuerySelectedNodesAtom';

const useRemoveSelection = makeUseChangeSearchQuery(() => {
  const selectedNodes = useRecoilValue(searchQuerySelectedNodesAtom);
  const getUseRemoveQuery = useGetRemoveQueryNode();

  return () => getUseRemoveQuery(selectedNodes);
});

export default useRemoveSelection;
