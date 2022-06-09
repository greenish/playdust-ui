import { useRecoilValue } from 'recoil';
import searchStateAtom from '../_atoms/searchStateAtom';
import SearchQueryNodeType from '../_types/SearchQueryNodeType';
import SearchStateType from '../_types/SearchStateType';

const useGetUpdateSearchQuery = () => {
  const { query } = useRecoilValue(searchStateAtom);

  return (
    updateNode: (node: SearchQueryNodeType) => SearchQueryNodeType | null,
    nodeAddition?: SearchQueryNodeType
  ): Pick<SearchStateType, 'query'> => {
    const normalizedQuery = nodeAddition
      ? {
          ...query,
          nodes: {
            ...query.nodes,
            [nodeAddition.id]: nodeAddition,
          },
        }
      : query;

    const updated = {
      ...normalizedQuery,
      nodes: Object.entries(normalizedQuery.nodes).reduce((acc, curr) => {
        const updatedNode = updateNode(curr[1]);

        if (updatedNode === null) {
          return acc;
        }

        return {
          ...acc,
          [updatedNode.id]: updatedNode,
        };
      }, {}),
    };

    return { query: updated };
  };
};

export default useGetUpdateSearchQuery;
