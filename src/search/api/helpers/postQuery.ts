import axios from 'axios'

const { OPENSEARCH_USER, OPENSEARCH_PASSWORD, OPENSEARCH_URL } = process.env

const postAxios = async (query: object, rest = '') => {
  const url = `${OPENSEARCH_URL}${rest}`

  const { data } = await axios.post(url, query, {
    auth: {
      username: OPENSEARCH_USER as string,
      password: OPENSEARCH_PASSWORD as string,
    },
  })

  return data
}

export const postScrollQuery = async (scrollId: string) => {
  const query = {
    scroll: '1m',
    scroll_id: scrollId,
  }

  return postAxios(query, '/_search/scroll')
}

const makePostQuery =
  (index: string) => async (query: object, addScroll?: boolean) => {
    const scrollParam = addScroll ? '?scroll=1m' : ''
    const path = `/${index}/_search${scrollParam}`

    return postAxios(query, path)
  }

export const postNFTQuery = makePostQuery('nft-metadata')
export const postCollectionQuery = makePostQuery('nft-collection')
export const postTransactionQuery = makePostQuery('nft-transaction')
