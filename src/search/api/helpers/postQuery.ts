import axios, { AxiosRequestHeaders } from 'axios'
import {
  CollectionSource,
  NFTSource,
  OpenSearchResponse,
} from '../../types/OpenSearchIndex'

const { OPENSEARCH_USER, OPENSEARCH_PASSWORD, OPENSEARCH_URL } = process.env

const postAxios = async (
  query: object | string,
  path = '',
  headers?: AxiosRequestHeaders
) => {
  const url = `${OPENSEARCH_URL}${path}`

  const { data } = await axios.post(url, query, {
    auth: {
      username: OPENSEARCH_USER as string,
      password: OPENSEARCH_PASSWORD as string,
    },
    headers,
  })

  return data
}

export const postNFTScrollQuery = async (scrollId: string) => {
  const query = {
    scroll: '1m',
    scroll_id: scrollId,
  }
  const result = await postAxios(query, '/_search/scroll')

  return result as OpenSearchResponse<NFTSource>
}

export const postMultiQuery = async (query: string) => {
  const headers = {
    'Content-type': 'application/x-ndjson',
  }

  const data = await postAxios(query, '/_msearch', headers)

  return data.responses as OpenSearchResponse<any>[]
}

function makePostQuery<T>(index: string) {
  return async (query: object, addScroll?: boolean) => {
    const scrollParam = addScroll ? '?scroll=1m' : ''
    const path = `/${index}/_search${scrollParam}`
    const result = await postAxios(query, path)

    return result as OpenSearchResponse<T>
  }
}

export const postNFTQuery = makePostQuery<NFTSource>('nft-metadata')
export const postCollectionQuery =
  makePostQuery<CollectionSource>('nft-collection')
export const postTransactionQuery = makePostQuery<any>('nft-transaction')
