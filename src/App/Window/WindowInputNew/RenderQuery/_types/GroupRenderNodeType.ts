import GroupNodeType from '../../_types/GroupNodeType';
import QueryRenderNodeStateType from './QueryRenderNodeStateType';

type GroupRenderNodeType = {
  type: 'groupStart' | 'groupEnd';
  parent: GroupNodeType | null;
  node: GroupNodeType;
  nodeState: QueryRenderNodeStateType;
};

export default GroupRenderNodeType;
