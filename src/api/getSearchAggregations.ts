import {
  QueryDslQueryContainer,
  SearchRequest,
} from '@opensearch-project/opensearch/api/types';
import { array, create, number, object, string, type } from 'superstruct';
import getQueryDependencyPath from '../App/Window/WindowInput/_helpers/getQueryDependencyPath';
import hasCollectionDependency from '../App/Window/WindowInput/_helpers/hasCollectionDependency';
import SearchAggResponseType from '../App/Window/WindowInput/_types/SearchAggResponseType';
import SearchQueryType from '../App/Window/_types/SearchQueryType';
import getAttributeAggQuery from './_helpers/getAttributeAggQuery';
import getNFTQueryById from './_helpers/getNFTQueryById';
import nextApiHandler from './_helpers/nextApiHandler';
import searchNFTs from './_helpers/searchNFTs';

const buildSuggestionQuery = (
  query: SearchQueryType,
  activeNodeId: string
): QueryDslQueryContainer => {
  const depPath = getQueryDependencyPath(query, activeNodeId);

  const queryList = depPath.map((children) =>
    children.map((entry) => getNFTQueryById(query, entry))
  );

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

const getSearchAggregationsNew = nextApiHandler<SearchAggResponseType>(
  async (req) => {
    const { query, activeNodeId } = create(req.body, SearchSuggestionInputType);
    const suggestionNFTQuery = buildSuggestionQuery(query, activeNodeId);
    const activeNode = query.nodes[activeNodeId];
    const isAttributeNode =
      activeNode.type === 'query' && activeNode.field === 'attribute';

    if (!hasCollectionDependency(query, activeNodeId)) {
      return [];
    }

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
      return payload.filter((entry) => entry.key === activeNode.key);
    }

    return payload;
  }
);

export default getSearchAggregationsNew;
