import ComposedQueryType from '../_types/ComposedQueryType';
import type SearchSortType from '../_types/SearchSortUnionType';
import getNFTQuery from './_helpers/getNFTQuery';
import nextApiHandler from './_helpers/nextApiHandler';
import postNFTQuery from './_helpers/postNFTQuery';

const makeGetSearchEnv = (key: string, defaultValue: number) => (): number => {
  const envVariable = process.env[key];

  if (typeof envVariable === 'number') {
    return envVariable;
  }

  return defaultValue;
};

const getInitialSearchSize = makeGetSearchEnv('SEARCH_INITIAL_SIZE', 100);
const getNextSearchSize = makeGetSearchEnv('SEARCH_NEXT_SIZE', 500);

const getSizeFrom = (page: number) => {
  const searchSize = getInitialSearchSize();
  const nextSearchSize = getNextSearchSize();

  if (page === 0) {
    return { size: searchSize, from: 0 };
  }

  const numNextBatches = page - 1;
  const from = searchSize + nextSearchSize * numNextBatches;

  return { size: nextSearchSize, from };
};

const getSearch = nextApiHandler(async (req) => {
  const query = req.body.query as ComposedQueryType;
  const sort = req.body.sort as SearchSortType;
  const page = req.body.page || (0 as number);
  const onlyListed = Boolean(req.body.onlyListed);

  const { size, from } = getSizeFrom(page);

  const nftQuery = getNFTQuery(query, size, sort, onlyListed, from);
  const nftResult = await postNFTQuery(nftQuery);

  const { hits } = nftResult;
  const nfts = hits.hits.map((entry) => entry._source);
  const total = hits.total.value as number;

  return { nfts, total, page };
});

export default getSearch;
