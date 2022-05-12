import type RangeQueryContentType from '../../../_types/RangeQueryContentType';
import updateQueryNode from '../_helpers/updateQueryNode';
import makeUseQueryChange from './makeUseQueryChange';

interface UseUpdateRangeNodeInput {
  id: string;
  update: Partial<RangeQueryContentType>;
}

const useUpdateRangeQueryNode = makeUseQueryChange<UseUpdateRangeNodeInput>(
  (query) =>
    ({ id, update }) => {
      const next = updateQueryNode(query, id, update);

      return { query: next };
    }
);

export default useUpdateRangeQueryNode;
