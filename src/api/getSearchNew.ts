import { create, type } from 'superstruct';
import SearchQueryType from '../App/Window/WindowInputNew/_types/SearchQueryType';
import type OpenSearchNFTSourceType from '../_types/OpenSearchNFTSourceType';
import SearchResponseType from '../_types/SearchResponseType';
import getNFTQueryById from './_helpers/getNFTQueryById';
import nextApiHandler from './_helpers/nextApiHandler';
import searchNFTs from './_helpers/searchNFTs';

const SearchRequestType = type({
  query: SearchQueryType,
});

const getSearchNew = nextApiHandler<SearchResponseType>(async (req) => {
  const { query } = create(req.body, SearchRequestType);
  const osQuery = getNFTQueryById(query, query.rootId);

  const results = await searchNFTs({ query: osQuery });

  const nfts = results.body.hits.hits.reduce<OpenSearchNFTSourceType[]>(
    (acc, curr) => {
      const source = curr._source;

      if (source) {
        return [...acc, source];
      }

      return acc;
    },
    []
  );

  return {
    nfts,
    total: results.body.hits.total as number,
    page: 1,
  };
});

export default getSearchNew;
