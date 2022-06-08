import { noWait, selector } from 'recoil';
import searchQueryActiveNodeAtom from '../../_atoms/searchQueryActiveNodeAtom';
import searchQueryTermAtom from '../../_atoms/searchQueryTermAtom';
import SearchSuggestionType from '../_types/SearchSuggestionType';
import clientSuggestionsAtom from './clientSuggestionsAtom';
import explorerSuggestionsAtom from './explorerSuggestionsAtom';
import groupSuggestionsAtom from './groupSuggestionsAtom';
import serverSuggestionsAtom from './serverSuggestionsAtom';

type SearchSuggestionAtomType = {
  suggestions: SearchSuggestionType[];
  loading: boolean;
};

const searchSuggestionsAtom = selector<SearchSuggestionAtomType>({
  key: 'searchSuggestionsAtom',
  get: ({ get }) => {
    const activeNode = get(searchQueryActiveNodeAtom);
    const term = get(searchQueryTermAtom);

    if (term.length === 0 && !activeNode) {
      return {
        loading: false,
        suggestions: [],
      };
    }

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

    return {
      loading:
        clientSuggestionsLoadable.state === 'loading' ||
        serverSuggestionsLoadable.state === 'loading',
      suggestions,
    };
  },
});

export default searchSuggestionsAtom;
