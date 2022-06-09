import SearchStateType from '../_types/SearchStateType';
import useGetUpdateSearchQuery from './useGetUpdateSearchQuery';

const useGetRemoveQueryNode = () => {
  const getUpdateSearchQuery = useGetUpdateSearchQuery();

  return (removalId: string): Pick<SearchStateType, 'query'> =>
    getUpdateSearchQuery((node) => {
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
};

export default useGetRemoveQueryNode;
