import type OpenSearchNFTSourceType from '../../_types/OpenSearchNFTSourceType';
import makePostMultiQuery from './makePostMultiQuery';

function postMultiNFTQuery<A = void>(query: string) {
  return makePostMultiQuery<OpenSearchNFTSourceType, A>()(query);
}

export default postMultiNFTQuery;
