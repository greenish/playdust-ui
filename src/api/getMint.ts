import esb from 'elastic-builder';
import OpenSearchNFTSourceType from '../App/Window/WindowSwitch/_types/OpenSearchNFTSourceType';
import nextApiHandler from './_helpers/nextApiHandler';
import postNFTQuery from './_helpers/postNFTQuery';

const getMint = nextApiHandler<OpenSearchNFTSourceType>(async (req) => {
  const mintAddress = req.query.address;

  if (typeof mintAddress !== 'string') {
    throw new Error('No valid `address` supplied!');
  }

  const requestBody = esb
    .requestBodySearch()
    .query(esb.matchQuery('mint', mintAddress))
    .toJSON();
  const result = await postNFTQuery(requestBody);
  const source = result?.hits?.hits[0]?._source;

  return source;
});

export default getMint;
