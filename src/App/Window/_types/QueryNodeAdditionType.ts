import type QueryContentType from '../../../_types/QueryContentType';
import type QueryOperationUnionType from '../../../_types/QueryOperationUnionType';

interface QueryNodeAdditionType {
  content: QueryContentType;
  operation: QueryOperationUnionType;
  at?: number;
}

export default QueryNodeAdditionType;
