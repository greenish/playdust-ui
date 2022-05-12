import type OpenSearchResponseType from '../_types/OpenSearchResponseType';
import postAxios from './postAxios';

function makePostQuery<T>(index: string) {
  return async (query: object, addScroll?: boolean) => {
    const scrollParam = addScroll ? '?scroll=1m' : '';
    const path = `/${index}/_search${scrollParam}`;
    const result = await postAxios(query, path);

    return result as OpenSearchResponseType<T>;
  };
}

export default makePostQuery;
