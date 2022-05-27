import GroupNodeType from '../../_types/GroupNodeType';
import QueryRenderNodeStateType from './QueryRenderNodeStateType';

type GroupRenderOperatorNodeType = {
  type: 'groupOperator';
  parent: GroupNodeType | null;
  node: GroupNodeType;
  index: number;
  nodeState: QueryRenderNodeStateType;
};

export default GroupRenderOperatorNodeType;
