import { atom } from 'recoil';
import SearchQueryActiveNodeType from '../_types/SearchQueryActiveNodeType';

const searchQueryActiveNodeAtom = atom<SearchQueryActiveNodeType | null>({
  key: 'searchQueryActiveNodeAtom',
  default: null,
});

export default searchQueryActiveNodeAtom;
