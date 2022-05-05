import type RangeQueryContentType from '../../../_types/RangeQueryContentType';
import addQueryNode from '../_helpers/addQueryNode';
import makeUseQueryChange from '../_helpers/makeUseQueryChange';
import type QueryNodeAdditionType from '../_types/QueryNodeAdditionType';

const useAddRangeQueryNode = makeUseQueryChange<
  Omit<RangeQueryContentType, 'field'>
>((query) => (value) => {
  const queryAddition: QueryNodeAdditionType = {
    content: {
      field: 'range',
      ...value,
    },
    operation: 'and',
    at: -1,
  };

  const next = addQueryNode(query, queryAddition);

  return { query: next };
});

export default useAddRangeQueryNode;
