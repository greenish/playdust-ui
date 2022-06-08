import { useRecoilValue } from 'recoil';
import searchStateAtom from '../_atoms/searchStateAtom';
import reduceSearchQuery from '../_helpers/reduceSearchQuery';
import removeQueryNode from '../_helpers/removeQueryNode';
import useChangeSearchQuery from './useChangeSearchQuery';

const useUpdateAttributeQueryNode = () => {
  const { query } = useRecoilValue(searchStateAtom);
  const changeSearchQuery = useChangeSearchQuery();

  return (id: string, value: string | null) => {
    changeSearchQuery(() => {
      if (value === null) {
        const next = removeQueryNode(query, id);

        return { query: next };
      }

      const updatedQuery = reduceSearchQuery(query, (node) => {
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

      return { query: updatedQuery };
    });
  };
};

export default useUpdateAttributeQueryNode;
