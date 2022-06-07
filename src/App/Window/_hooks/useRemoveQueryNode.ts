import useGoHome from '../../_hooks/useGoHome';
import makeUseChangeSearchQuery from './makeUseChangeSearchQuery';
import useGetUpdateSearchQuery from './useGetUpdateSearchQuery';

const useRemoveQueryNode = makeUseChangeSearchQuery(() => {
  const goHome = useGoHome();
  const getUpdateSearchQuery = useGetUpdateSearchQuery();

  return (removalId: string) => {
    const updated = getUpdateSearchQuery((node) => {
      if (node.id === removalId) {
        return null;
      }

      if (node.type === 'group' && node.children.includes(removalId)) {
        return {
          ...node,
          children: node.children.filter((child) => child !== removalId),
        };
      }

      return node;
    });

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
