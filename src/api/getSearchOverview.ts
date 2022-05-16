import { NextApiRequest } from 'next';
import ComposedQueryType from '../_types/ComposedQueryType';
import type SearchOverviewResponseType from '../_types/SearchOverviewResponseType';
import getNFTQuery from './_helpers/getNFTQuery';
import nextApiHandler from './_helpers/nextApiHandler';
import postMultiNFTQuery from './_helpers/postMultiNFTQuery';
import queriesToMultiSearch from './_helpers/queriesToMultiSearch';

interface SearchOverviewAggregationType {
  floor: {
    value: number;
  };
  ceiling: {
    value: number;
  };
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    query?: ComposedQueryType;
    onlyListed?: boolean;
  };
}

const getSearchOverview = nextApiHandler<SearchOverviewResponseType>(
  async (req: ExtendedNextApiRequest): Promise<SearchOverviewResponseType> => {
    const { query } = req.body;

    if (!query) {
      throw new Error('No `query` supplied!');
    }

    const countQuery = getNFTQuery(query, 0);
    const nftQueryListed = getNFTQuery(query, 0, undefined, true);

    const aggQuery = {
      ...nftQueryListed,
      aggs: {
        ceiling: { max: { field: 'lastListPrice' } },
        floor: { min: { field: 'lastListPrice' } },
      },
    };

    const multiQuery = queriesToMultiSearch(
      [aggQuery, countQuery],
      'nft-metadata'
    );

    const [aggResult, countResult] =
      await postMultiNFTQuery<SearchOverviewAggregationType>(multiQuery);

    const listed = aggResult.hits.total.value;
    const floor = aggResult.aggregations.floor.value;
    const ceiling = aggResult.aggregations.ceiling.value;
    const count = countResult.hits.total.value;

    return {
      listed,
      floor,
      ceiling,
      count,
    };
  }
);

export default getSearchOverview;
