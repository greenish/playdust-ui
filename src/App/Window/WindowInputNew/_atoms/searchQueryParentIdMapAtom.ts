import { selector } from 'recoil';
import { is } from 'superstruct';
import GroupNodeType from '../_types/GroupNodeType';
import type SearchQueryType from '../_types/SearchQueryType';
import searchQueryNewAtom from './searchQueryAtom';

type SearchQueryParentIdMap = {
  [nodeId: string]: string | null;
};
const makeParentIdMap = (
  nodes: SearchQueryType['nodes'],
  rootId: string
): SearchQueryParentIdMap => {
  const parentMap: SearchQueryParentIdMap = {};

  function getParentIds(id: string, parentId?: string): void {
    const node = nodes[id];

    parentMap[id] = parentId ?? null;

    if (is(node, GroupNodeType)) {
      node.children.flatMap((childId) => getParentIds(childId, id));
    }
  }

  getParentIds(rootId);

  return parentMap;
};

const searchQueryParentIdMapAtom = selector<SearchQueryParentIdMap>({
  key: 'searchQueryParentIdMapAtom',
  get: ({ get }) => {
    const { rootId, nodes } = get(searchQueryNewAtom);

    return makeParentIdMap(nodes, rootId);
  },
});

export default searchQueryParentIdMapAtom;
