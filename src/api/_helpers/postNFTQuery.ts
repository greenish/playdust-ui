import type OpenSearchNFTSourceType from '../../App/Window/WindowSwitch/_types/OpenSearchNFTSourceType';
import makePostQuery from './makePostQuery';

const postNFTQuery = makePostQuery<OpenSearchNFTSourceType>('nft-metadata');

export default postNFTQuery;
