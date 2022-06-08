import { ApiResponse } from '@opensearch-project/opensearch';
import { SearchResponse } from '@opensearch-project/opensearch/api/types';

const getOSTotalValue = (results: ApiResponse<SearchResponse>) => {
  const totalPath = results.body.hits.total;
  const total = typeof totalPath === 'number' ? totalPath : totalPath.value;

  return total;
};

export default getOSTotalValue;
