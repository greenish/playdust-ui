import { nanoid } from 'nanoid';
import { selector } from 'recoil';
import type SearchResponseType from '../../../_types/SearchResponseType';
import api from '../_helpers/frontendApi';
import searchState from './searchStateAtom';

const initialState = {
  total: 0,
  cursor: '',
  nfts: [],
};

const searchResultsBaseAtom = selector<SearchResponseType>({
  key: 'searchResultsBaseAtom',
  get: async ({ get }) => {
    try {
      const parsed = get(searchState);

      if (!parsed || parsed.query.length === 0) {
        return initialState;
      }

      if (parsed.query.length === 0) {
        return initialState;
      }

      const cleaned = {
        ...parsed,
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
  },
});

export default searchResultsBaseAtom;
