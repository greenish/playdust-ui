import axios, { AxiosRequestHeaders } from 'axios'

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

export default postAxios
