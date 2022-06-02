import {
  QueryDslQueryContainer,
  SearchRequest,
} from '@opensearch-project/opensearch/api/types';
import { array, create, number, object, string, type } from 'superstruct';
import SearchQueryType from '../App/Window/WindowInputNew/_types/SearchQueryType';
import getAttributeAggQuery from './_helpers/getAttributeAggQuery';
import getNFTQueryById from './_helpers/getNFTQueryById';
import nextApiHandler from './_helpers/nextApiHandler';
import searchNFTs from './_helpers/searchNFTs';

const makeGetPathFromRoot = (query: SearchQueryType) => {
  const nodeList = Object.values(query.nodes);

  function getPathFromRoot(paths: string[], currId: string): string[] {
    if (currId === query.rootId) {
      return [query.rootId, ...paths];
    }

    const found = nodeList.find(
      (entry) => entry.type === 'group' && entry.children.includes(currId)
    );

    if (!found) {
      return paths;
    }

    return [...getPathFromRoot(paths, found.id), currId];
  }

  return getPathFromRoot;
};

const buildSuggestionQuery = (
  query: SearchQueryType,
  pathToSuggestion: string[]
): QueryDslQueryContainer => {
  const queryList = pathToSuggestion.map((currId, idx) => {
    const currNode = query.nodes[currId];
    const isGroup = currNode.type === 'group';
    const isOrGroup = isGroup && currNode.operator === 'or';
    const isLast = idx === pathToSuggestion.length - 1;

    if (!isGroup || isOrGroup) {
      return undefined;
    }

    const filteredChildren = isLast
      ? currNode.children
      : currNode.children.filter(
          (childId) => !pathToSuggestion.includes(childId)
        );

    return filteredChildren.map((entry) => getNFTQueryById(query, entry));
  });

  const flattened = queryList.reduce<QueryDslQueryContainer[]>((acc, curr) => {
    if (curr === undefined) {
      return acc;
    }

    return [...acc, ...(Array.isArray(curr) ? curr : [curr])];
  }, []);

  return {
    bool: {
      must: flattened,
    },
  };
};

const SearchAttributeAggType = type({
  name: object({
    doc_count: number(),
    trait: object({
      doc_count_error_upper_bound: number(),
      sum_other_doc_count: number(),
      buckets: array(
        object({
          key: string(),
          doc_count: number(),
          value: object({
            doc_count_error_upper_bound: number(),
            sum_other_doc_count: number(),
            buckets: array(
              object({
                key: string(),
                doc_count: number(),
              })
            ),
          }),
        })
      ),
    }),
  }),
});

const SearchSuggestionInputType = type({
  query: SearchQueryType,
  activeNodeId: string(),
});

const getSearchAggregationsNew = nextApiHandler(async (req) => {
  const { query, activeNodeId } = create(req.body, SearchSuggestionInputType);
  const pathToSuggestion = makeGetPathFromRoot(query)([], activeNodeId);
  const suggestionNFTQuery = buildSuggestionQuery(query, pathToSuggestion);
  const activeNode = query.nodes[activeNodeId];
  const isAttributeNode =
    activeNode.type !== 'group' && activeNode.field === 'attribute';

  const aggQuery = getAttributeAggQuery();
  const aggRequest: SearchRequest['body'] = {
    ...aggQuery,
    query: suggestionNFTQuery,
  };

  const results = await searchNFTs(aggRequest);
  const aggregations = create(
    results.body.aggregations,
    SearchAttributeAggType
  );

  const payload = aggregations.name.trait.buckets.map((bucket) => ({
    key: bucket.key,
    values: bucket.value.buckets.map((bucketValue) => ({
      value: bucketValue.key,
      count: bucketValue.doc_count,
    })),
  }));

  if (isAttributeNode) {
    return payload.filter((entry) => entry.key === activeNode.trait);
  }

  return payload;
});

export default getSearchAggregationsNew;
