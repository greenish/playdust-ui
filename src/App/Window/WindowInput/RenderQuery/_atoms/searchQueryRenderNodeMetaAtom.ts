import { selectorFamily } from 'recoil';
import searchQueryActiveNodeMetaAtom from '../../../_atoms/searchQueryActiveNodeMetaAtom';
import searchStateAtom from '../../../_atoms/searchStateAtom';
import GroupNodeType from '../../../_types/GroupNodeType';
import searchQuerySelectedNodesAtom from '../../_atoms/searchQuerySelectedNodesAtom';
import RenderMapNodeType from '../_types/RenderMapNodeType';
import searchQueryPathToRootAtom from './searchQueryPathToRootAtom';

type SearchQueryRenderNodeMetaAtomType = {
  isActive: boolean;
  higlightBackground: boolean;
  renderLineBelow: boolean;
  renderLineAbove: boolean;
};

const searchQueryRenderNodeIsSelectedAtom = selectorFamily<
  boolean,
  RenderMapNodeType
>({
  key: 'searchQueryRenderNodeIsSelectedAtom',
  get:
    (renderNode) =>
    ({ get }) => {
      const selectedNodes = get(searchQuerySelectedNodesAtom);

      if (selectedNodes.length === 0) {
        return false;
      }

      const { query } = get(searchStateAtom);
      const pathToRoot = get(
        searchQueryPathToRootAtom(renderNode.node.id)
      ).filter((entry) => entry !== query.rootId);
      const activeNodeMeta = get(searchQueryActiveNodeMetaAtom);

      const nearestGroupId = GroupNodeType.is(renderNode.node)
        ? renderNode.node.id
        : renderNode.parent && renderNode.parent.id;

      const intersections = selectedNodes.filter((selected) =>
        pathToRoot.includes(selected)
      );

      if (
        activeNodeMeta?.type === 'group' &&
        activeNodeMeta.isGroupSelected &&
        nearestGroupId &&
        nearestGroupId === activeNodeMeta.nodeId
      ) {
        return true;
      }

      if (intersections.length) {
        return true;
      }

      if (selectedNodes.includes(renderNode.node.id)) {
        return true;
      }

      if (
        renderNode.type === 'groupOperator' &&
        renderNode.node.id === activeNodeMeta?.nodeId
      ) {
        const assignedChild = renderNode.node.children[renderNode.index];

        if (selectedNodes.includes(assignedChild)) {
          return true;
        }
      }

      return false;
    },
});

const searchQueryRenderNodeMetaAtom = selectorFamily<
  SearchQueryRenderNodeMetaAtomType,
  RenderMapNodeType
>({
  key: 'searchQueryRenderNodeMetaAtom',
  get:
    (renderNode: RenderMapNodeType) =>
    ({ get }) => {
      const isSelected = get(searchQueryRenderNodeIsSelectedAtom(renderNode));
      const selectedNodes = get(searchQuerySelectedNodesAtom);

      const isBelowActive =
        renderNode.activeDistance !== null &&
        renderNode.activeDistance >= 1 &&
        renderNode.inActiveBranch;

      const isActive =
        renderNode.activeDistance !== null &&
        renderNode.activeDistance === 0 &&
        renderNode.inActiveBranch;

      const higlightBackground =
        isSelected || (isBelowActive && selectedNodes.length === 0);

      const renderLineBelow =
        renderNode.activeDistance !== null && renderNode.activeDistance >= 0;

      const renderLineAbove =
        renderNode.activeDistance !== null &&
        renderNode.activeDistance >= 2 &&
        renderNode.inActiveBranch;

      return {
        isActive,
        higlightBackground,
        renderLineBelow,
        renderLineAbove,
      };
    },
});

export default searchQueryRenderNodeMetaAtom;
