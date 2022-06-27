import { selector } from 'recoil';
import SearchSuggestionType from '../_types/SearchSuggestionType';
import searchQueryActiveNodeAtom from './searchQueryActiveNodeAtom';
import searchQuerySelectedNodesAtom from './searchQuerySelectedNodesAtom';

const selectionSuggestionsAtom = selector<SearchSuggestionType[] | null>({
  key: 'selectionSuggestionsAtom',
  get: ({ get }) => {
    const selectedNodes = get(searchQuerySelectedNodesAtom);
    const activeNode = get(searchQueryActiveNodeAtom);

    if (!selectedNodes.length || activeNode?.type !== 'group') {
      return null;
    }

    const inverseOperator = activeNode.operator === 'and' ? 'or' : 'and';

    return [
      {
        key: 'selection-remove',
        label: 'Remove Selection',
        group: 'Selection',
        action: 'remove',
      },
      {
        key: 'selection-group',
        label: `Group Selection in ${inverseOperator.toUpperCase()}`,
        group: 'Selection',
        action: 'group',
      },
    ];
  },
});

export default selectionSuggestionsAtom;
