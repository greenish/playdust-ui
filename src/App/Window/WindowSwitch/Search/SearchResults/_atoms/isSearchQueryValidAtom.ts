import { selector } from 'recoil';
import searchStateAtom from '../../../../_atoms/searchStateAtom';
import validateSearchQuery from '../../../../_helpers/validateSearchQuery';

const isSearchQueryValidAtom = selector({
  key: 'isSearchQueryValidAtom',
  get: ({ get }) => {
    const { query } = get(searchStateAtom);

    return validateSearchQuery(query);
  },
});

export default isSearchQueryValidAtom;
