import { useRecoilValue } from 'recoil';
import useGoHome from '../../_hooks/useGoHome';
import searchStateAtom from '../_atoms/searchStateAtom';
import removeQueryNode from '../_helpers/removeQueryNode';
import useChangeSearchQuery from './useChangeSearchQuery';

const useRemoveQueryNode = () => {
  const changeSearchQuery = useChangeSearchQuery();
  const { query } = useRecoilValue(searchStateAtom);
  const goHome = useGoHome();

  return (id: string) => {
    const nextQuery = removeQueryNode(query, id);

    const hasQueryNode = Object.values(nextQuery.nodes).some(
      (entry) => entry.type === 'query'
    );

    if (!hasQueryNode) {
      return goHome();
    }

    return changeSearchQuery({ query: nextQuery });
  };
};

export default useRemoveQueryNode;
