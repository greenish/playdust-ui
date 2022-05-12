import { selector } from 'recoil';
import searchQueryValid from './searchQueryValidAtom';

const searchQueryNoRangesAtom = selector({
  key: 'searchQueryNoRangesAtom',
  get: ({ get }) => {
    const query = get(searchQueryValid);
    const result = query.filter((entry) => entry[0].field !== 'range');

    return result;
  },
});

export default searchQueryNoRangesAtom;
