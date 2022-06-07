import { nullable, number, object, type } from 'superstruct';
import type SearchOverviewResponseType from '../App/Window/WindowSwitch/Search/SearchOverview/_types/SearchOverviewResponseType';
import SearchQueryType from '../App/Window/_types/SearchQueryType';
import getNFTSearchRequest from './_helpers/getNFTSearchRequest';
import getOSTotalValue from './_helpers/getOSTotalValue';
import nextApiHandler from './_helpers/nextApiHandler';
import searchNFTs from './_helpers/searchNFTs';

const SearchOverviewRequest = type({
  query: SearchQueryType,
});

const SearchOverviewAggType = type({
  ceiling: object({
    value: nullable(number()),
  }),
  floor: object({
    value: nullable(number()),
  }),
  average: object({
    value: nullable(number()),
  }),
});

const getSearchOverview = nextApiHandler<SearchOverviewResponseType>(
  async (req) => {
    const { query } = SearchOverviewRequest.create(req.body);

    if (!query) {
      throw new Error('No `query` supplied!');
    }

    const nftBody = getNFTSearchRequest(query, { onlyListed: true });

    const results = await searchNFTs({
      ...nftBody,
      aggs: {
        ceiling: { max: { field: 'lastListPrice' } },
        floor: { min: { field: 'lastListPrice' } },
        average: { avg: { field: 'lastListPrice' } },
      },
      size: 0,
    });

    const listed = getOSTotalValue(results);
    const { ceiling, floor, average } = SearchOverviewAggType.create(
      results.body.aggregations
    );

    return {
      listed,
      ceiling: ceiling.value || 0,
      floor: floor.value || 0,
      average: average.value || 0,
    };
  }
);

export default getSearchOverview;
