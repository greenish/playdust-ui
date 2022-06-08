import { useRecoilValue } from 'recoil';
import searchStateAtom from '../../../../_atoms/searchStateAtom';
import reduceSearchQuery from '../../../../_helpers/reduceSearchQuery';
import useChangeSearchQuery from '../../../../_hooks/useChangeSearchQuery';

const useToggleGroupOperator = () => {
  const { query } = useRecoilValue(searchStateAtom);
  const changeSearchQuery = useChangeSearchQuery();

  return (groupNodeId: string) => {
    const updatedQuery = reduceSearchQuery(query, (node) => {
      if (node.type === 'group' && node.id === groupNodeId) {
        return {
          ...node,
          operator: node.operator === 'and' ? 'or' : 'and',
        };
      }

      return node;
    });

    changeSearchQuery({ query: updatedQuery });
  };
};

export default useToggleGroupOperator;
