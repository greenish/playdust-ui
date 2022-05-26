import { selector } from 'recoil';
import { is } from 'superstruct';
import GroupNodeType from '../_types/GroupNodeType';
import type SearchQueryNodeType from '../_types/SearchQueryNodeType';
import type SearchQueryType from '../_types/SearchQueryType';
import searchQueryNewAtom from './searchQueryAtom';

const makeFlattenNodes = (
  nodes: SearchQueryType['nodes'],
  rootNode: GroupNodeType
) =>
  function flattenNode(id?: string): SearchQueryNodeType[] {
    const node = id ? nodes[id] : rootNode;

    if (!is(node, GroupNodeType)) {
      return [node];
    }

    const nextList = [
      ...node.children.flatMap((childId) => flattenNode(childId)),
      node,
    ];

    return nextList;
  };

const searchQueryOrderedAtom = selector({
  key: 'searchQueryOrderedAtom',
  get: ({ get }) => {
    const { rootNode, nodes } = get(searchQueryNewAtom);

    return makeFlattenNodes(nodes, rootNode)();
  },
});

export default searchQueryOrderedAtom;
