import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
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

const fetchSearchSuggestions = selector<
  SearchSuggestionResponseType | undefined
>({
  key: 'fetchSearchSuggestions',
  get: async ({ get }) => {
    const term = get(searchSuggestionTerm);
    const isCollectionQuery = get(isCollectionQueryAtom);

    if (isCollectionQuery) {
      return undefined;
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

const getFuzzySuggestion = (term: string): SearchSuggestionType => ({
  key: 'fuzzy-search',
  group: 'Search',
  label: `search for ${term}`,
  type: 'search',
});

const getAggregationSuggestions = (
  attributes: AttributeResponseType,
  selected: AttributeQueryNodeType[],
  term: string
) => {
  const result = attributes.flatMap(({ trait, options }) => {
    const parentFound = selected.find((entry) => entry.trait === trait);

    return options
      .filter((option) => !(parentFound && parentFound.value.includes(option)))
      .map((option) => {
        const combined = `${trait}: ${option}`;
        const matched = match(combined, term, {
          findAllOccurrences: true,
          insideWords: true,
        });
        const parsed = parse(combined, matched);
        const highlight = parsed
          .map((portion) => {
            if (!portion.highlight) {
              return portion.text;
            }

            return `<em>${portion.text}</em>`;
          })
          .join('');

        const suggestion: SearchSuggestionType = {
          key: `attribute:${trait}:${option}`,
          group: 'Attribute',
          label: highlight,
          attributeMeta: {
            trait,
            option,
          },
          type: 'search',
        };

        return suggestion;
      });
  });

  return result;
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
      const fuzzySuggestion = getFuzzySuggestion(term);

      if (current !== '') {
        const aggregations = get(noWait(searchAggregations));

        if (aggregations.state === 'hasValue') {
          const attributeNodes = get(searchQueryAttributes);
          const { attributes } = aggregations.contents;
          const aggSuggestions = getAggregationSuggestions(
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

      const { state, contents } = get(noWait(fetchSearchSuggestions));
      const results = state === 'hasValue' ? contents : [];

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
          label: `block ${term}`,
          type: 'block',
        });
        addSuggestion({
          key: 'epoch-search',
          group: 'Explorer',
          label: `epoch ${term}`,
          type: 'epoch',
        });
      }

      if (windowType === 'address') {
        addSuggestion({
          key: 'account-search',
          group: 'Explorer',
          label: `account ${term}`,
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
          label: `transaction ${term}`,
          type: 'tx',
        });

        return {
          suggestions,
          loading: false,
        };
      }

      addSuggestion(fuzzySuggestion);

      if (state === 'hasValue' && contents) {
        const serverSuggestions = getServerSuggestions(contents);
        serverSuggestions.map(addSuggestion);
      }

      return {
        suggestions,
        loading: state === 'loading',
      };
    },
});

export default searchSuggestionsAtom;
