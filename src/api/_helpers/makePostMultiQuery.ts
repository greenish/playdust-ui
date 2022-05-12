import type OpenSearchResponseType from '../_types/OpenSearchResponseType';
import postAxios from './postAxios';

function makePostMultiQuery<T = unknown, A = unknown>() {
  return async (query: string) => {
    const headers = {
      'Content-type': 'application/x-ndjson',
    };

    const data = await postAxios(query, '/_msearch', headers);

    return data.responses as OpenSearchResponseType<T, A>[];
  };
}

export default makePostMultiQuery;
