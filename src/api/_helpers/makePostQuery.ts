import type OpenSearchResponseType from '../_types/OpenSearchResponseType';
import postAxios from './postAxios';

function makePostQuery<T>(index: string) {
  return async (query: object) => {
    const path = `/${index}/_search`;
    const result = await postAxios(query, path);

    return result as OpenSearchResponseType<T>;
  };
}

export default makePostQuery;
