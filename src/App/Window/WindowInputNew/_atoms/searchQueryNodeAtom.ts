import { DefaultValue, selectorFamily } from 'recoil';
import { is } from 'superstruct';
import GroupNodeType from '../_types/GroupNodeType';
import SearchQueryNodeType from '../_types/SearchQueryNodeType';
import SearchQueryType from '../_types/SearchQueryType';
import searchQueryAtom from './searchQueryAtom';

const searchQueryNodeAtom = selectorFamily<SearchQueryNodeType | null, string|null>({
  key: 'searchQueryNodeAtom',
  get: (nodeId) => function({ get }) {
    const searchQuery = get(searchQueryAtom);

    if(nodeId === null) {
      return searchQuery.rootNode;
    }
    return searchQuery.nodes[nodeId] ?? null;
  },
  set: (nodeId) => ({ set, get }, newValue) => {
    if (newValue instanceof DefaultValue || newValue === null) {
      return;
    }

    const searchQuery = get(searchQueryAtom);

    if(
      (nodeId === null && newValue.id !== searchQuery.rootNode.id) 
      || newValue.id !== nodeId
    ) {
      return;
    }

    if(
      (nodeId === null || nodeId === searchQuery.rootNode.id) 
      && is(newValue, GroupNodeType)
    ) {
      return set<SearchQueryType>(searchQueryAtom, {
        ...searchQuery,
        rootNode: newValue
      });
    }

    return set<SearchQueryType>(searchQueryAtom, {
      ...searchQuery,
      nodes: {
        ...searchQuery.nodes,
        [nodeId]: newValue
      }
    });
  },
});

export default searchQueryNodeAtom;
