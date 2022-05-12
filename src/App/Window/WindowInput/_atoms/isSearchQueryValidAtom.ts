import { selector } from 'recoil';
import searchStateUncommitted from '../../_atoms/searchStateUncommittedAtom';
import queryValidationPredicate from '../../_helpers/queryValidationPredicate';

const isSearchQueryValidAtom = selector<boolean>({
  key: 'isSearchQueryValidAtom',
  get: ({ get }) => {
    const flattened = get(searchStateUncommitted).query.flat();

    const result = flattened.every(queryValidationPredicate);

    return result;
  },
});

export default isSearchQueryValidAtom;
