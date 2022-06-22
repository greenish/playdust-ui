import useGoHome from '../../../_hooks/useGoHome';
import makeUseChangeSearchQuery from './makeUseChangeSearchQuery';
import useGetRemoveQueryNode from './useGetRemoveQueryNode';

const useRemoveQueryNode = makeUseChangeSearchQuery(() => {
  const goHome = useGoHome();
  const getRemoveQueryNode = useGetRemoveQueryNode();

  return (removalId: string) => {
    const updated = getRemoveQueryNode(removalId);

    const hasQueryNode = Object.values(updated.query.nodes).some(
      (entry) => entry.type === 'query'
    );

    if (!hasQueryNode) {
      return goHome();
    }

    return updated;
  };
});

export default useRemoveQueryNode;
