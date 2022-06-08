import { array, create, string } from 'superstruct';
import type OpenSearchNFTSourceType from '../App/Window/WindowSwitch/_types/OpenSearchNFTSourceType';
import nextApiHandler from './_helpers/nextApiHandler';
import postNFTQuery from './_helpers/postNFTQuery';

const getMints = nextApiHandler<OpenSearchNFTSourceType[]>(async (req) => {
  const mints = create(req.body, array(string()));

  const nftQuery = {
    size: mints.length,
    query: {
      ids: {
        values: mints,
      },
    },
  };

  const results = await postNFTQuery(nftQuery);
  const sources = results.hits.hits.map((entry) => entry._source);

  return sources;
});

export default getMints;
