import { DefaultValue, selectorFamily } from 'recoil';
import SearchQueryNodeType from '../_types/SearchQueryNodeType';
import SearchQueryType from '../_types/SearchQueryType';
import searchQueryAtom from './searchQueryAtom';

const searchQueryNodeAtom = selectorFamily<SearchQueryNodeType | null, string>({
  key: 'searchQueryNodeAtom',
  get: (nodeId) =>
    function ({ get }) {
      const searchQuery = get(searchQueryAtom);
      return searchQuery.nodes[nodeId] ?? null;
    },
  set:
    (nodeId) =>
    ({ set, get }, newValue) => {
      if (newValue instanceof DefaultValue || newValue === null) {
        return;
      }

      const searchQuery = get(searchQueryAtom);

      return set<SearchQueryType>(searchQueryAtom, {
        ...searchQuery,
        nodes: {
          ...searchQuery.nodes,
          [nodeId]: newValue,
        },
      });
    },
});

export default searchQueryNodeAtom;
