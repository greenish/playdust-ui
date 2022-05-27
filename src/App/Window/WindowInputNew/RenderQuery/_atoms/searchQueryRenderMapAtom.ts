import { selector } from 'recoil';
import { is } from 'superstruct';
import searchQueryActiveNodeAtom from '../../_atoms/searchQueryActiveNodeAtom';
import searchQueryNewAtom from '../../_atoms/searchQueryAtom';
import GroupNodeType from '../../_types/GroupNodeType';
import SearchQueryActiveNodeType from '../../_types/SearchQueryActiveNodeType';
import type SearchQueryType from '../../_types/SearchQueryType';
import GroupRenderNodeType from '../_types/GroupRenderNodeType';
import GroupRenderOperatorNodeType from '../_types/GroupRenderOperatorNodeType';
import QueryRenderNodeStateType from '../_types/QueryRenderNodeStateType';
import QueryRenderNodeType from '../_types/QueryRenderNodeType';

type RenderMap = (
  | QueryRenderNodeType
  | GroupRenderNodeType
  | GroupRenderOperatorNodeType
)[];

const makeRenderMap = (
  nodes: SearchQueryType['nodes'],
  rootId: string,
  activeNode: SearchQueryActiveNodeType | null
): RenderMap => {
  const renderMap: RenderMap = [];
  const activeSearchQueryNode = activeNode?.nodeId
    ? nodes[activeNode?.nodeId] ?? null
    : null;

  function traverse(
    state: QueryRenderNodeStateType,
    id: string,
    parent?: GroupNodeType,
    secondParent?: GroupNodeType
  ): void {
    const node = nodes[id];

    const newState = { ...state };
    newState.isActive = node.id === activeNode?.nodeId;

    if (is(activeSearchQueryNode, GroupNodeType)) {
      newState.is2BelowActive =
        newState.isBelowActive || secondParent?.id === activeSearchQueryNode.id;
      newState.isBelowActive =
        newState.isBelowActive || parent?.id === activeSearchQueryNode.id;
    }

    if (is(node, GroupNodeType)) {
      newState.isAboveActive =
        newState.isAboveActive ||
        node.children.includes(activeNode?.nodeId ?? '');

      renderMap.push({
        type: 'groupStart',
        parent: parent ?? null,
        node,
        nodeState: newState,
      });
      node.children.forEach((childId, index) => {
        renderMap.push({
          type: 'groupOperator',
          parent: parent ?? null,
          node,
          index,
          nodeState: newState,
        });

        traverse(newState, childId, node, parent);
      });
      renderMap.push({
        type: 'groupEnd',
        parent: parent ?? null,
        node,
        nodeState: newState,
      });
    } else if (parent) {
      renderMap.push({
        type: 'query',
        parent: parent ?? null,
        node,
        nodeState: newState,
      });
    }
  }

  traverse(
    {
      isActive: false,
      isBelowActive: false,
      is2BelowActive: false,
      isAboveActive: false,
    },
    rootId
  );

  return renderMap;
};

const searchQueryRenderMapAtom = selector<RenderMap>({
  key: 'searchQueryRenderMapAtom',
  get: ({ get }) => {
    const { rootId, nodes } = get(searchQueryNewAtom);
    const activeNode = get(searchQueryActiveNodeAtom);

    return makeRenderMap(nodes, rootId, activeNode);
  },
});

export default searchQueryRenderMapAtom;
