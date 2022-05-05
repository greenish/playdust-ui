import { atom } from 'recoil';

const searchSuggestionTerm = atom<string>({
  key: 'searchSuggestionTerm',
  default: '',
});

export default searchSuggestionTerm;
