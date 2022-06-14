import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { boolean, optional, type } from 'superstruct';
import SearchAggResponseType from '../App/Window/WindowInput/_types/SearchAggResponseType';
import GroupNodeType from '../App/Window/_types/GroupNodeType';
import SearchQueryType from '../App/Window/_types/SearchQueryType';
import getAttributeAggQuery from './_helpers/getAttributeAggQuery';
import getNFTDependencyQueryById from './_helpers/getNFTDependencyQueryById';
import nextApiHandler from './_helpers/nextApiHandler';
import parseAttributeAggs from './_helpers/parseAttributeAggs';
import searchNFTs from './_helpers/searchNFTs';

const SearchTopAggsInput = type({
  query: SearchQueryType,
  onlyListed: optional(boolean()),
});

const getSearchTopAggregations = nextApiHandler<SearchAggResponseType>(
  async (req) => {
    const { query, onlyListed } = SearchTopAggsInput.create(req.body);
    const rootNode = GroupNodeType.create(query.nodes[query.rootId]);
    const nodeKeys = [rootNode.id, ...rootNode.children].filter((entry) => {
      const childNode = query.nodes[entry];

      if (childNode.type === 'query' && childNode.field === 'collection') {
        return false;
      }

      return true;
    });

    const combinedQuery = nodeKeys.map((nodeKey) =>
      getNFTDependencyQueryById(query, nodeKey)
    );
    const nftQuery: QueryDslQueryContainer = {
      bool: {
        should: combinedQuery,
        minimum_should_match: 1,
      },
    };

    const aggQuery = getAttributeAggQuery();
    const searchRequest = {
      ...aggQuery,
      query: nftQuery,
    };

    const [results] = await searchNFTs([
      {
        body: searchRequest,
        options: { onlyListed },
      },
    ]);

    return parseAttributeAggs(results.aggregations);
  }
);

export default getSearchTopAggregations;
