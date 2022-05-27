import QueryNodeType from '../../../../../_types/QueryNodeType';
import GroupNodeType from '../../_types/GroupNodeType';
import QueryRenderNodeStateType from './QueryRenderNodeStateType';

type QueryRenderNodeType = {
  type: 'query';
  parent: GroupNodeType;
  node: QueryNodeType;
  nodeState: QueryRenderNodeStateType;
};

export default QueryRenderNodeType;
