import { matchSorter } from 'match-sorter';
import { noWait, selector, selectorFamily } from 'recoil';
import type AttributeQueryNodeType from '../../../../_types/AttributeQueryNodeType';
import type AttributeResponseType from '../../../../_types/AttributeResponseType';
import type OpenSearchCollectionSourceHighlightType from '../../../../_types/OpenSearchCollectionSourceHighlightType';
import type SearchSuggestionResponseType from '../../../../_types/SearchSuggestionResponseType';
import isCollectionQueryAtom from '../../_atoms/isCollectionQueryAtom';
import searchAggregations from '../../_atoms/searchAggregationsAtom';
import searchQueryAttributes from '../../_atoms/searchQueryAttributesAtom';
import frontendApi from '../../_helpers/frontendApi';
import getWindowType from '../_helpers/getWindowType';
import type SearchSuggestionType from '../_types/SearchSuggestionType';
import searchSuggestionTerm from './searchSuggestionTermAtom';

const fetchSearchSuggestions = selector<SearchSuggestionResponseType | null>({
  key: 'fetchSearchSuggestions',
  get: async ({ get }) => {
    const term = get(searchSuggestionTerm);
    const isCollectionQuery = get(isCollectionQueryAtom);

    if (isCollectionQuery) {
      return null;
    }

    const { data } = await frontendApi.post<SearchSuggestionResponseType>(
      '/search-suggestions',
      {
        term,
      }
    );

    return data;
  },
});

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

interface SearchSuggetionResults {
  suggestions: SearchSuggestionType[];
  loading: boolean;
}

const defaultSuggestions = {
  suggestions: [],
  loading: false,
};

const getClientSuggestions = (
  attributes: AttributeResponseType,
  selected: AttributeQueryNodeType[],
  term: string
) => {
  const result = attributes.flatMap(({ trait, options }) => {
    const parentFound = selected.find((entry) => entry.trait === trait);

    return options
      .filter((option) => !(parentFound && parentFound.value.includes(option)))
      .map((option) => {
        const suggestion: SearchSuggestionType = {
          key: `attribute:${trait}:${option}`,
          group: 'Attribute',
          label: `${trait}: ${option}`,
          attributeMeta: {
            trait,
            option,
          },
          type: 'search',
        };

        return suggestion;
      });
  });

  const uppercasedTerm = term.toUpperCase();
  const matched = matchSorter(result, term, { keys: ['label'] });
  const withHighlight: SearchSuggestionType[] = matched.map((entry) => ({
    ...entry,
    label: entry.label
      .split(' ')
      .map((word) => {
        let matchCount = 0;
        const chars = word.split('');
        const highlighted = chars
          .map((char) => {
            if (uppercasedTerm.includes(char.toUpperCase())) {
              matchCount += 1;

              return `<em>${char}</em>`;
            }

            return char;
          })
          .join('');

        return matchCount > 1 ? highlighted : word;
      })
      .join(' '),
  }));

  return withHighlight;
};

const getServerSuggestions = ({
  collections,
  attributeNames,
  attributeValues,
}: SearchSuggestionResponseType) => {
  const suggestions: SearchSuggestionType[] = [];

  collections.map((collection) =>
    suggestions.push({
      key: collection.source.id,
      group: 'Collections',
      label: `${
        collection.source.name || collection.source.symbol
      }: ${getHighlight(collection)}`,
      type: 'search',
      meta: collection.source.id,
    })
  );

  attributeNames.map((attributeName) =>
    suggestions.push({
      key: `attributeName:${attributeName.actual}`,
      group: 'Attribute Trait',
      label: `has: ${attributeName.highlight}`,
      meta: attributeName.actual,
      type: 'search',
    })
  );

  attributeValues.map((attributeValue) =>
    suggestions.push({
      key: `attributeValue:${attributeValue.actual}`,
      group: 'Attribute Value',
      label: `equals: ${attributeValue.highlight}`,
      meta: attributeValue.actual,
      type: 'search',
    })
  );

  return suggestions;
};

const searchSuggestionsAtom = selectorFamily<SearchSuggetionResults, string>({
  key: 'searchSuggestionsAtom',
  get:
    (current) =>
    ({ get }) => {
      const term = get(searchSuggestionTerm);
      const highlightedTerm = `<em>${term}</em>`;
      const fuzzySuggestion: SearchSuggestionType = {
        key: 'fuzzy-search',
        group: 'Search',
        label: `search for ${highlightedTerm}`,
        type: 'search',
      };

      if (current !== '') {
        const aggregations = get(noWait(searchAggregations));

        if (aggregations.state === 'hasValue') {
          const attributeNodes = get(searchQueryAttributes);
          const { attributes } = aggregations.contents;
          const aggSuggestions = getClientSuggestions(
            attributes,
            attributeNodes,
            term
          );

          return {
            suggestions:
              term === ''
                ? aggSuggestions
                : [fuzzySuggestion, ...aggSuggestions],
            loading: false,
          };
        }

        return defaultSuggestions;
      }

      if (term === '') {
        return defaultSuggestions;
      }

      const searchSuggestions = get(noWait(fetchSearchSuggestions));
      const results =
        searchSuggestions.state === 'hasValue'
          ? searchSuggestions.contents
          : [];

      if (!results) {
        return defaultSuggestions;
      }

      const suggestions: SearchSuggestionType[] = [];
      const addSuggestion = (newSuggestion: SearchSuggestionType) =>
        suggestions.push(newSuggestion);

      const windowType = getWindowType(term);

      if (windowType === 'block' || windowType === 'epoch') {
        addSuggestion({
          key: 'block-search',
          group: 'Explorer',
          label: `block ${highlightedTerm}`,
          type: 'block',
        });
        addSuggestion({
          key: 'epoch-search',
          group: 'Explorer',
          label: `epoch ${highlightedTerm}`,
          type: 'epoch',
        });
      }

      if (windowType === 'address') {
        addSuggestion({
          key: 'address-search',
          group: 'Explorer',
          label: `address ${highlightedTerm}`,
          type: 'address',
        });

        return {
          suggestions,
          loading: false,
        };
      }

      if (windowType === 'tx') {
        addSuggestion({
          key: 'transaction-search',
          group: 'Explorer',
          label: `transaction ${highlightedTerm}`,
          type: 'tx',
        });

        return {
          suggestions,
          loading: false,
        };
      }

      addSuggestion(fuzzySuggestion);

      if (
        searchSuggestions.state === 'hasValue' &&
        searchSuggestions.contents
      ) {
        const serverSuggestions = getServerSuggestions(
          searchSuggestions.contents
        );
        serverSuggestions.map(addSuggestion);
      }

      return {
        suggestions,
        loading: searchSuggestions.state === 'loading',
      };
    },
});

export default searchSuggestionsAtom;
