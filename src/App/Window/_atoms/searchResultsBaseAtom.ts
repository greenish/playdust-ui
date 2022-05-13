import { selector } from 'recoil';
import type SearchResponseType from '../../../_types/SearchResponseType';
import fetchSearchResults from '../_helpers/fetchSearchResults';
import searchStateSerializedAtom from './searchStateSerializedAtom';

const searchResultsBaseAtom = selector<SearchResponseType>({
  key: 'searchResultsBaseAtom',
  get: async ({ get }) => {
    const serialized = get(searchStateSerializedAtom);

    return fetchSearchResults(serialized, 0);
  },
});

export default searchResultsBaseAtom;
