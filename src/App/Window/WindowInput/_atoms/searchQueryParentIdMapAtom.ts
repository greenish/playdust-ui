import { selector } from 'recoil';
import { is } from 'superstruct';
import searchStateAtom from '../../_atoms/searchStateAtom';
import GroupNodeType from '../../_types/GroupNodeType';
import type SearchQueryType from '../../_types/SearchQueryType';
import SearchQueryParentIdMapType from '../_types/SearchQueryParentIdMapType';

const makeParentIdMap = (
  nodes: SearchQueryType['nodes'],
  rootId: string
): SearchQueryParentIdMapType => {
  const parentMap: SearchQueryParentIdMapType = {};

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

const searchQueryParentIdMapAtom = selector<SearchQueryParentIdMapType>({
  key: 'searchQueryParentIdMapAtom',
  get: ({ get }) => {
    const { rootId, nodes } = get(searchStateAtom).query;

    return makeParentIdMap(nodes, rootId);
  },
});

export default searchQueryParentIdMapAtom;
