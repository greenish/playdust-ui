import { matchSorter } from 'match-sorter';
import { selector } from 'recoil';
import SearchAggResponseType from '../../../../../_types/SearchAggResponseType';
import searchQueryActiveNodeAtom from '../../_atoms/searchQueryActiveNodeAtom';
import searchQueryAtom from '../../_atoms/searchQueryAtom';
import searchQueryTermAtom from '../../_atoms/searchQueryTermAtom';
import type SearchQueryNodeType from '../../_types/SearchQueryNodeType';
import SearchSuggestionNewType from '../_types/SearchSuggestionNewType';
import searchAggsByNodeAtom from './searchAggsByNodeAtom';

const getClientSuggestions = (
  term: string,
  attributes: SearchAggResponseType,
  activeNode: SearchQueryNodeType
) => {
  const isAttributeNode =
    activeNode.type !== 'group' && activeNode.field === 'attribute';

  const result: SearchSuggestionNewType[] = attributes.flatMap((attribute) =>
    attribute.values.map((entry) => ({
      key: `attribute:${attribute.key}:${entry.value}`,
      group: 'Attribute',
      label: `${attribute.key}: ${
        entry.value
      } (${entry.count.toLocaleString()})`,
      attributeMeta: {
        key: attribute.key,
        value: entry.value,
      },
      type: 'search',
      selected: isAttributeNode
        ? activeNode.value.includes(entry.value)
        : false,
    }))
  );

  const uppercasedTerm = term.toUpperCase();
  const matched = matchSorter(result, term, { keys: ['label'] });
  const withHighlight: SearchSuggestionNewType[] = matched
    .map((entry) => ({
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

                return `<b>${char}</b>`;
              }

              return char;
            })
            .join('');

          return matchCount > 1 ? highlighted : word;
        })
        .join(' '),
    }))
    .sort((a) => {
      if (a.selected) {
        return -1;
      }

      return 0;
    });

  return withHighlight;
};

const searchSuggestionsNewAtom = selector({
  key: 'searchSuggestionsNewAtom',
  get: ({ get }) => {
    const { nodes } = get(searchQueryAtom);
    const activeNodeId = get(searchQueryActiveNodeAtom);
    const searchTerm = get(searchQueryTermAtom);
    const searchAggs = get(searchAggsByNodeAtom);
    const activeNode = activeNodeId && nodes[activeNodeId.nodeId];

    if (!searchAggs || !activeNode) {
      return null;
    }

    const suggestions = getClientSuggestions(
      searchTerm,
      searchAggs,
      activeNode
    );

    return suggestions;
  },
});

export default searchSuggestionsNewAtom;
