import { selector } from 'recoil';
import type SearchResponseType from '../../../_types/SearchResponseType';
import searchResultsBase from './searchResultsBaseAtom';
import searchResultsMore from './searchResultsMoreAtom';

const searchResultsAtom = selector<SearchResponseType>({
  key: 'searchResultsAtom',
  get: ({ get }) => {
    const base = get(searchResultsBase);
    const more = get(searchResultsMore);

    return {
      ...base,
      nfts: [...base.nfts, ...more],
    };
  },
});

export default searchResultsAtom;
