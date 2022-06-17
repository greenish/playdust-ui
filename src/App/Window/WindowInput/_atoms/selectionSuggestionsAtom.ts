import { selector } from 'recoil';
import searchQueryActiveNodeMetaAtom from '../../_atoms/searchQueryActiveNodeMetaAtom';
import SearchSuggestionType from '../_types/SearchSuggestionType';
import searchQueryActiveNodeAtom from './searchQueryActiveNodeAtom';
import searchQuerySelectedNodesAtom from './searchQuerySelectedNodesAtom';

const selectionSuggestionsAtom = selector<SearchSuggestionType[] | null>({
  key: 'selectionSuggestionsAtom',
  get: ({ get }) => {
    const selectedNodes = get(searchQuerySelectedNodesAtom);
    const activeNode = get(searchQueryActiveNodeAtom);
    const activeNodeMeta = get(searchQueryActiveNodeMetaAtom);

    if (!selectedNodes.length || activeNode?.type !== 'group') {
      return null;
    }

    const inverseOperator = activeNode.operator === 'and' ? 'or' : 'and';

    if (activeNodeMeta?.type === 'group' && activeNodeMeta?.isGroupSelected) {
      return [
        {
          key: 'selection-remove-group',
          label: 'Remove Group and Nodes',
          group: 'Selection',
          action: 'remove',
        },
      ];
    }

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
