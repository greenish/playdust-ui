import type {
  SearchRequest,
  SearchResponse,
} from '@opensearch-project/opensearch/api/types';
import OpenSearchNFTSourceType from '../../_types/OpenSearchNFTSourceType';
import osClient from './osClient';

async function searchNFTs<SourceType = OpenSearchNFTSourceType>(
  body: SearchRequest['body']
) {
  const results = await osClient.search<SearchResponse<SourceType>>({
    index: 'nft-metadata',
    body,
  });

  return results;
}

export default searchNFTs;
