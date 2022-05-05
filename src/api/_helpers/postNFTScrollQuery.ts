import type OpenSearchNFTSourceType from '../../_types/OpenSearchNFTSourceType';
import makePostScrollQuery from './makePostScrollQuery';

const postNFTScrollQuery = makePostScrollQuery<OpenSearchNFTSourceType>();

export default postNFTScrollQuery;
