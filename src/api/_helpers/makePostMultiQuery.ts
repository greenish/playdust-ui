import type OpenSearchResponseType from '../_types/OpenSearchResponseType';
import postAxios from './postAxios';

function makePostMultiQuery<T = unknown, A = unknown>() {
  return async (query: string) => {
    const headers = {
      'Content-type': 'application/x-ndjson',
    };

    const data = await postAxios<{ responses: OpenSearchResponseType<T, A>[] }>(
      query,
      '/_msearch',
      headers
    );

    return data.responses;
  };
}

export default makePostMultiQuery;
