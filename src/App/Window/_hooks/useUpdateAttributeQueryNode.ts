import makeUseChangeSearchQuery from './makeUseChangeSearchQuery';
import useGetRemoveQueryNode from './useGetRemoveQueryNode';
import useGetUpdateSearchQuery from './useGetUpdateSearchQuery';

const useUpdateAttributeQueryNode = makeUseChangeSearchQuery(() => {
  const getRemoveQueryNode = useGetRemoveQueryNode();
  const getUpdateSearchQuery = useGetUpdateSearchQuery();

  return (id: string, value: string | null) => {
    if (value === null) {
      return getRemoveQueryNode(id);
    }

    return getUpdateSearchQuery((node) => {
      if (
        node.id === id &&
        node.type === 'query' &&
        node.field === 'attribute'
      ) {
        return {
          ...node,
          value,
        };
      }

      return node;
    });
  };
});

export default useUpdateAttributeQueryNode;
