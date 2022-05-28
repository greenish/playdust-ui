import QueryNodeType from '../../../../../_types/QueryNodeType';
import GroupNodeType from '../../_types/GroupNodeType';

type QueryRenderNodeType = {
  type: 'query';
  parent: GroupNodeType;
  node: QueryNodeType;
  inActiveBranch: boolean;
  activeDistance: number | null;
};

export default QueryRenderNodeType;
