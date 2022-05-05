import { selector } from 'recoil';
import searchQueryValid from '../../../_atoms/searchQueryValid';

const isRangeQuery = selector({
  key: 'isRangeQuery',
  get: ({ get }) => {
    const valid = get(searchQueryValid);

    return valid[0][0].field === 'range';
  },
});

export default isRangeQuery;
