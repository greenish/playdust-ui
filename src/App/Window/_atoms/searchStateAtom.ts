import { selector } from 'recoil';
import parseSearch from '../_helpers/parseSearch';
import sortOptions from '../_helpers/sortOptions';
import type SearchStateType from '../_types/SearchStateType';
import windowState from './windowStateAtom';

const searchStateAtom = selector<SearchStateType>({
  key: 'searchStateAtom',
  get: ({ get }) => {
    const current = get(windowState);

    if (!current || current.type !== 'search' || current.state === '') {
      return {
        query: {
          rootId: '',
          nodes: {},
        },
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
