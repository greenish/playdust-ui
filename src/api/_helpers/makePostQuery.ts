import type OpenSearchResponseType from '../_types/OpenSearchResponseType';
import postAxios from './postAxios';

function makePostQuery<ResponseType>(index: string) {
  return async (query: object) => {
    const path = `/${index}/_search`;
    return postAxios<OpenSearchResponseType<ResponseType>>(query, path);
  };
}

export default makePostQuery;
