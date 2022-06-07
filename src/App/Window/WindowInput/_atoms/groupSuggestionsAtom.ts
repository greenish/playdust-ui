import { selector } from 'recoil';
import searchQueryActiveNodeAtom from './searchQueryActiveNodeAtom';
import searchQueryActiveNodeMetaAtom from '../../_atoms/searchQueryActiveNodeMetaAtom';
import searchQueryTermAtom from './searchQueryTermAtom';
import SearchSuggestionType from '../_types/SearchSuggestionType';

const groupSuggestionsAtom = selector<SearchSuggestionType[] | null>({
  key: 'groupSuggestionsAtom',
  get: ({ get }) => {
    const activeNodeMeta = get(searchQueryActiveNodeMetaAtom);
    const term = get(searchQueryTermAtom);
    const activeNode = get(searchQueryActiveNodeAtom);

    if (
      activeNodeMeta?.type === 'group' &&
      activeNode?.type === 'group' &&
      term === '('
    ) {
      const operator = activeNode.operator === 'and' ? 'or' : 'and';
      const numOptions = activeNode.children.length - activeNodeMeta.index + 1;
      const startOption = activeNodeMeta.index;
      const suggestions: SearchSuggestionType[] = [
        ...Array(numOptions).keys(),
      ].map((entry) => {
        const endIdx = entry + startOption;

        return {
          key: `group-${endIdx}`,
          group: 'Group',
          label: `end ${operator.toUpperCase()} group at ${endIdx}`,
          operator,
          endIdx,
        };
      });

      return suggestions;
    }

    return null;
  },
});

export default groupSuggestionsAtom;
