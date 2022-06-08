import type {
  SearchRequest,
  SearchResponse,
} from '@opensearch-project/opensearch/api/types';
import OpenSearchNFTSourceType from '../../App/Window/WindowSwitch/_types/OpenSearchNFTSourceType';
import osClient from './osClient';

async function searchNFTs(body: SearchRequest['body']) {
  const results = await osClient.search<
    SearchResponse<OpenSearchNFTSourceType>
  >({
    index: 'nft-metadata',
    body,
  });

  return results;
}

export default searchNFTs;
