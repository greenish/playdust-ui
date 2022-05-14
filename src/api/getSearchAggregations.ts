import { NextApiRequest } from 'next';
import ComposedQueryType from '../_types/ComposedQueryType';
import type SearchAggregationResponseType from '../_types/SearchAggregationResponseType';
import type { AttributeAggregationType } from './_helpers/getAllAttributes';
import getAllAttributes from './_helpers/getAllAttributes';
import getNFTQuery from './_helpers/getNFTQuery';
import nextApiHandler from './_helpers/nextApiHandler';
import postMultiNFTQuery from './_helpers/postMultiNFTQuery';
import queriesToMultiSearch from './_helpers/queriesToMultiSearch';

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    query?: ComposedQueryType;
    onlyListed?: boolean;
  };
}

const getSearchAggregations = nextApiHandler<SearchAggregationResponseType>(
  async (
    req: ExtendedNextApiRequest
  ): Promise<SearchAggregationResponseType> => {
    const { query } = req.body;
    const onlyListed = Boolean(req.body.onlyListed);

    if (!query) {
      throw new Error('No `query` supplied!');
    }

    const nftQuery = getNFTQuery(query, 0, undefined, onlyListed);

    const { attributeQueries, cleanAttributes } = getAllAttributes(
      query,
      nftQuery
    );

    const attributeMultiQuery = queriesToMultiSearch(
      attributeQueries,
      'nft-metadata'
    );

    const attributeResults = await postMultiNFTQuery<AttributeAggregationType>(
      attributeMultiQuery
    );
    const attributes = cleanAttributes(attributeResults);

    return { attributes };
  }
);

export default getSearchAggregations;
