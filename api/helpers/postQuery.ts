import axios from 'axios'

const { OPENSEARCH_USER, OPENSEARCH_PASSWORD, OPENSEARCH_URL } = process.env

const postQuery = async (query: {}) => {
  const { data } = await axios.post(`${OPENSEARCH_URL}/_search`, query, {
    auth: {
      username: OPENSEARCH_USER as string,
      password: OPENSEARCH_PASSWORD as string,
    },
  })

  return data
}

export default postQuery
