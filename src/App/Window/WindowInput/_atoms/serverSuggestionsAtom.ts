import { selector } from 'recoil';
import searchQueryTermAtom from './searchQueryTermAtom';
import frontendApi from '../../_helpers/frontendApi';
import type OpenSearchCollectionSourceHighlightType from '../_types/OpenSearchCollectionSourceHighlightType';
import type SearchSuggestionResponseType from '../_types/SearchSuggestionResponseType';
import SearchSuggestionType from '../_types/SearchSuggestionType';
import hasCollectionDependencyAtom from './hasCollectionDependencyAtom';
import searchQueryDebouncedTermAtom from './searchQueryDebouncedTermAtom';
import searchQueryTermWindowTypeAtom from './searchQueryTermWindowTypeAtom';

const getHighlight = ({
  highlight,
}: OpenSearchCollectionSourceHighlightType) => {
  const highlightArray =
    highlight.description || highlight.name || highlight.symbol;

  if (highlightArray) {
    return highlightArray[0];
  }

  return '';
};

const formatServerSuggestions = ({
  collections,
}: // attributeNames,
// attributeValues,
SearchSuggestionResponseType) => {
  const suggestions: SearchSuggestionType[] = [];

  collections.map((collection) =>
    suggestions.push({
      key: collection.source.id,
      group: 'Collections',
      label: `${
        collection.source.name || collection.source.symbol
      }: ${getHighlight(collection)}`,
      collectionId: collection.source.id,
    })
  );

  // attributeNames.map((attributeName) =>
  //   suggestions.push({
  //     key: `attributeName:${attributeName.actual}`,
  //     group: 'Attribute Trait',
  //     label: `has: ${attributeName.highlight}`,
  //     meta: attributeName.actual,
  //     type: 'search',
  //   })
  // );

  // attributeValues.map((attributeValue) =>
  //   suggestions.push({
  //     key: `attributeValue:${attributeValue.actual}`,
  //     group: 'Attribute Value',
  //     label: `equals: ${attributeValue.highlight}`,
  //     meta: attributeValue.actual,
  //     type: 'search',
  //   })
  // );

  return suggestions;
};

const serverSuggestionsAtom = selector<SearchSuggestionType[] | null>({
  key: 'serverSuggestionsAtom',
  get: async ({ get }) => {
    const term = get(searchQueryTermAtom);
    const debouncedTerm = get(searchQueryDebouncedTermAtom);
    const hasCollectionDependency = get(hasCollectionDependencyAtom);
    const windowType = get(searchQueryTermWindowTypeAtom);

    if (
      term !== debouncedTerm ||
      debouncedTerm.length < 3 ||
      hasCollectionDependency ||
      windowType === 'address' ||
      windowType === 'tx'
    ) {
      return null;
    }

    try {
      const { data } = await frontendApi.post<SearchSuggestionResponseType>(
        '/search-suggestions',
        {
          term: debouncedTerm,
        }
      );

      return formatServerSuggestions(data);
    } catch {
      return null;
    }
  },
});

export default serverSuggestionsAtom;
