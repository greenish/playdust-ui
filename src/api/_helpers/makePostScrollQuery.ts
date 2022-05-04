import type OpenSearchResponseType from '../../_types/OpenSearchResponseType'
import postAxios from './postAxios'

function makePostScrollQuery<T>() {
  return async (scrollId: string) => {
    const query = {
      scroll: '1m',
      scroll_id: scrollId,
    }
    const result = await postAxios(query, '/_search/scroll')

    return result as OpenSearchResponseType<T>
  }
}

export default makePostScrollQuery
