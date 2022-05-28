import { selector } from 'recoil';
import { is } from 'superstruct';
import searchQueryActiveNodeAtom from '../../_atoms/searchQueryActiveNodeAtom';
import searchQueryNewAtom from '../../_atoms/searchQueryAtom';
import searchQueryParentIdMapAtom from '../../_atoms/searchQueryParentIdMapAtom';
import GroupNodeType from '../../_types/GroupNodeType';
import SearchQueryActiveNodeType from '../../_types/SearchQueryActiveNodeType';
import SearchQueryParentIdMapType from '../../_types/SearchQueryParentIdMapType';
import type SearchQueryType from '../../_types/SearchQueryType';
import GroupRenderNodeType from '../_types/GroupRenderNodeType';
import GroupRenderOperatorNodeType from '../_types/GroupRenderOperatorNodeType';
import QueryRenderNodeType from '../_types/QueryRenderNodeType';

type RenderMap = (
  | QueryRenderNodeType
  | GroupRenderNodeType
  | GroupRenderOperatorNodeType
)[];

type GroupedRenderMap = RenderMap[];

const makeRenderMap = (
  nodes: SearchQueryType['nodes'],
  rootId: string,
  activeNode: SearchQueryActiveNodeType | null,
  parentIdMap: SearchQueryParentIdMapType
): RenderMap => {
  const renderMap: RenderMap = [];
  const activeSearchQueryNode = activeNode?.nodeId
    ? nodes[activeNode?.nodeId] ?? null
    : null;
  const activeNodeParents: string[] = [];

  if (activeSearchQueryNode) {
    let currentId: string | null = activeSearchQueryNode.id;
    while (currentId !== null) {
      activeNodeParents.push(currentId);
      currentId = parentIdMap[currentId];
    }
  }

  function traverse(
    id: string,
    activeDistance: number | null,
    inActiveBranch: boolean,
    parent?: GroupNodeType
  ): void {
    const node = nodes[id];

    let newActiveDistance = activeDistance;
    let newInActiveBranch = false;
    if (newActiveDistance !== null) {
      if (activeNodeParents.includes(id)) {
        newInActiveBranch = true;
      } else if (newActiveDistance > 0) {
        newInActiveBranch = inActiveBranch;
      }
      if (activeNodeParents.includes(id) || newActiveDistance >= 0) {
        newActiveDistance += 1;
      }
    }

    if (is(node, GroupNodeType)) {
      renderMap.push({
        type: 'groupStart',
        parent: parent ?? null,
        node,
        inActiveBranch: newInActiveBranch,
        activeDistance,
      });
      node.children.forEach((childId, index) => {
        renderMap.push({
          type: 'groupOperator',
          parent: parent ?? null,
          node,
          index,
          inActiveBranch: newInActiveBranch,
          activeDistance,
        });

        traverse(childId, newActiveDistance, newInActiveBranch, node);
      });
      renderMap.push({
        type: 'groupEnd',
        parent: parent ?? null,
        node,
        inActiveBranch: newInActiveBranch,
        activeDistance,
      });
    } else if (parent) {
      renderMap.push({
        type: 'query',
        parent: parent ?? null,
        node,
        inActiveBranch: newInActiveBranch,
        activeDistance,
      });
    }
  }

  traverse(
    rootId,
    activeNodeParents.length > 0 ? -(activeNodeParents.length - 1) : null,
    false
  );

  return renderMap;
};

const searchQueryRenderMapAtom = selector<GroupedRenderMap>({
  key: 'searchQueryRenderMapAtom',
  get: ({ get }) => {
    const { rootId, nodes } = get(searchQueryNewAtom);
    const activeNode = get(searchQueryActiveNodeAtom);
    const parentIdMap = get(searchQueryParentIdMapAtom);

    const renderMap = makeRenderMap(nodes, rootId, activeNode, parentIdMap);

    // group query to controll line-wraps (always before operators)
    const groupedRenderMap: GroupedRenderMap = [];
    let currentGroup: RenderMap = [];
    renderMap.forEach((node, i) => {
      if (
        node.type === 'groupOperator' &&
        renderMap[i - 1].type !== 'groupStart'
      ) {
        groupedRenderMap.push(currentGroup);
        currentGroup = [];
      }
      currentGroup.push(node);
    });
    groupedRenderMap.push(currentGroup);

    return groupedRenderMap;
  },
});

export default searchQueryRenderMapAtom;
