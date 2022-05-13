import { nanoid } from 'nanoid';
import type SearchResponseType from '../../../_types/SearchResponseType';
import api from './frontendApi';
import parseSearch from './parseSearch';

const initialState = {
  total: 0,
  page: 0,
  nfts: [],
};

const fetchSearchResults = async (
  serialized: string,
  page: number
): Promise<SearchResponseType> => {
  try {
    const parsed = parseSearch(serialized);

    if (!parsed || parsed.query.length === 0) {
      return initialState;
    }

    if (parsed.query.length === 0) {
      return initialState;
    }

    const cleaned = {
      ...parsed,
      page,
      query: parsed.query.map((parent) =>
        parent.map((child) => ({
          ...child,
          id: nanoid(),
        }))
      ),
    };

    const { data } = await api.post<SearchResponseType>('/search', cleaned);

    return data;
  } catch (err) {
    return initialState;
  }
};

export default fetchSearchResults;
