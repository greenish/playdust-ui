import type QueryOperationUnionType from '../../../_types/QueryOperationUnionType';
import addQueryNode from '../_helpers/addQueryNode';
import type QueryNodeAdditionType from '../_types/QueryNodeAdditionType';
import makeUseQueryChange from './makeUseQueryChange';

interface UseAddAttributeNodeInput {
  value: string[];
  trait: string;
  operation: QueryOperationUnionType;
  at?: number;
}

const useAddAttributeQueryNode = makeUseQueryChange<UseAddAttributeNodeInput>(
  (query) =>
    ({ value, trait, operation, at }) => {
      const queryAddition: QueryNodeAdditionType = {
        content: {
          field: 'attribute',
          value,
          trait,
        },
        operation,
        at,
      };

      const next = addQueryNode(query, queryAddition);

      return { query: next };
    }
);

export default useAddAttributeQueryNode;
