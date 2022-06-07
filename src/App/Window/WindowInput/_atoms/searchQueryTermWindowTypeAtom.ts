import { selector } from 'recoil';
import { WindowUnionType } from '../../../_types/WindowUnionType';
import getWindowType from '../_helpers/getWindowType';
import searchQueryDebouncedTermAtom from './searchQueryDebouncedTermAtom';

const searchQueryTermWindowTypeAtom = selector<WindowUnionType>({
  key: 'searchQueryTermWindowTypeAtom',
  get: ({ get }) => {
    const debouncedTerm = get(searchQueryDebouncedTermAtom);

    return getWindowType(debouncedTerm);
  },
});

export default searchQueryTermWindowTypeAtom;
