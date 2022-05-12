import { selector } from 'recoil';
import parseSearch from '../_helpers/parseSearch';
import sortOptions from '../_helpers/sortOptions';
import type SearchStateType from '../_types/SearchStateType';
import currentState from './currentStateAtom';

const searchStateAtom = selector<SearchStateType>({
  key: 'searchStateAtom',
  get: ({ get }) => {
    const current = get(currentState);

    if (!current || current.type !== 'search' || current.state === '') {
      return {
        query: [],
      };
    }

    const result = parseSearch(current.state);
    const withDefaults: SearchStateType = {
      ...result,
      sort: result.sort || sortOptions[0].value,
    };

    return withDefaults;
  },
});

export default searchStateAtom;
