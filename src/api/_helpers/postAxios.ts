import axios, { AxiosRequestHeaders } from 'axios';

const { OPENSEARCH_USER, OPENSEARCH_PASSWORD, OPENSEARCH_URL } = process.env;

const postAxios = async <ResponseType>(
  query: object | string,
  path = '',
  headers?: AxiosRequestHeaders
): Promise<ResponseType> => {
  const url = `${OPENSEARCH_URL as string}${path}`;

  const { data } = await axios.post<ResponseType>(url, query, {
    auth: {
      username: OPENSEARCH_USER as string,
      password: OPENSEARCH_PASSWORD as string,
    },
    headers,
  });

  return data;
};

export default postAxios;
