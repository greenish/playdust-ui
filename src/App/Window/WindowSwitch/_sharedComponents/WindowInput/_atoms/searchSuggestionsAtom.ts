import { noWait, selector } from 'recoil';
import SearchSuggestionType from '../_types/SearchSuggestionType';
import clientSuggestionsAtom from './clientSuggestionsAtom';
import explorerSuggestionsAtom from './explorerSuggestionsAtom';
import groupSuggestionsAtom from './groupSuggestionsAtom';
import searchQueryTermAtom from './searchQueryTermAtom';
import serverSuggestionsAtom from './serverSuggestionsAtom';

type SearchSuggestionAtomType = {
  suggestions: SearchSuggestionType[];
  loading: boolean;
};

const searchSuggestionsAtom = selector<SearchSuggestionAtomType>({
  key: 'searchSuggestionsAtom',
  get: ({ get }) => {
    const term = get(searchQueryTermAtom);
    const suggestions: SearchSuggestionType[] = [];

    const fuzzySuggestion: SearchSuggestionType = {
      key: 'fuzzy-search',
      group: 'Search',
      label: `search for <b>${term}</b>`,
    };
    const noResults: SearchSuggestionType = {
      key: 'no-results',
      group: 'No Results',
      label: '<i>No reults found...</i>',
    };
    const clientSuggestionsLoadable = get(noWait(clientSuggestionsAtom));
    const serverSuggestionsLoadable = get(noWait(serverSuggestionsAtom));
    const explorerSuggestions = get(explorerSuggestionsAtom);
    const groupSuggestions = get(groupSuggestionsAtom);

    if (groupSuggestions) {
      return {
        suggestions: groupSuggestions,
        loading: false,
      };
    }

    if (term.length > 0) {
      suggestions.push(fuzzySuggestion);
    }

    if (explorerSuggestions) {
      suggestions.push(...explorerSuggestions);
    }

    if (clientSuggestionsLoadable.state === 'hasValue') {
      const { contents } = clientSuggestionsLoadable;

      if (contents) {
        suggestions.push(...(contents.length === 0 ? [noResults] : contents));
      }
    }

    if (serverSuggestionsLoadable.state === 'hasValue') {
      const { contents } = serverSuggestionsLoadable;

      if (contents) {
        suggestions.push(...(contents.length === 0 ? [noResults] : contents));
      }
    }

    const loading =
      clientSuggestionsLoadable.state === 'loading' ||
      serverSuggestionsLoadable.state === 'loading';

    return {
      loading,
      suggestions,
    };
  },
});

export default searchSuggestionsAtom;
