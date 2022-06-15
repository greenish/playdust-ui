import SearchQueryType from '../_types/SearchQueryType';
import type SearchStateType from '../_types/SearchStateType';
import updateSearchQueryNodes from './updateSearchQueryNodes';
import validateSearchQuery from './validateSearchQuery';

const dehydrateSearchQuery = (query: SearchQueryType): SearchQueryType => {
  const keyMap = Object.keys(query.nodes).reduce<{
    [currKey: string]: string;
  }>(
    (acc, curr, idx) => ({
      ...acc,
      [curr]: idx.toString(),
    }),
    {}
  );

  const dehydratedQuery: SearchQueryType = {
    rootId: keyMap[query.rootId] || '',
    nodes: updateSearchQueryNodes(query.nodes, (node) => {
      const newNode = {
        ...node,
        id: keyMap[node.id],
      };

      if (newNode.type === 'query') {
        return newNode;
      }

      return {
        ...newNode,
        children: newNode.children.map((childId) => keyMap[childId]),
      };
    }),
  };

  return dehydratedQuery;
};

const serializeSearch = (state: SearchStateType) => {
  const { query, sort, onlyListed } = state;
  const dehydrated = dehydrateSearchQuery(query);

  if (!validateSearchQuery(dehydrated)) {
    return '';
  }

  const raw = {
    query: dehydrated,
    sort,
    onlyListed,
  };

  const result = JSON.stringify(raw);

  return result;
};

export default serializeSearch;
