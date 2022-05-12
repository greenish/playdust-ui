import { atom } from 'recoil';

const searchSuggestionTermAtom = atom<string>({
  key: 'searchSuggestionTermAtom',
  default: '',
});

export default searchSuggestionTermAtom;
