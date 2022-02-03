import axios from 'axios'

const { OPENSEARCH_USER, OPENSEARCH_PASSWORD, OPENSEARCH_URL } = process.env

const openSearch = async (requestBody: object) => {
  try {
    const { data } = await axios.post(
      `${OPENSEARCH_URL}/_search`,
      requestBody,
      {
        auth: {
          username: OPENSEARCH_USER as string,
          password: OPENSEARCH_PASSWORD as string,
        },
      }
    )

    return data
  } catch (e) {
    console.error(e)
  }
}

export default openSearch
