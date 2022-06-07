import { nanoid } from 'nanoid';
import { useRecoilState, useRecoilValue } from 'recoil';
import encodeWindowHash from '../../../../../_helpers/encodeWindowHash';
import usePushWindowHash from '../../../../../_hooks/usePushWindowHash';
import type { WindowStateType } from '../../../../../_types/WindowStateType';
import searchQueryActiveNodeAtom from '../../../../_atoms/searchQueryActiveNodeAtom';
import searchQueryActiveNodeMetaAtom from '../../../../_atoms/searchQueryActiveNodeMetaAtom';
import searchQueryRootNodeAtom from '../../../../_atoms/searchQueryRootNodeAtom';
import searchQueryTermAtom from '../../../../_atoms/searchQueryTermAtom';
import searchStateUncommitted from '../../../../_atoms/searchStateUncommittedAtom';
import windowStateAtom from '../../../../_atoms/windowStateAtom';
import serializeSearch from '../../../../_helpers/serializeSearch';
import GroupNodeType from '../../../../_types/GroupNodeType';
import type SearchActiveNodeMetaType from '../../../../_types/SearchActiveNodeMetaType';
import SearchQueryNodeType from '../../../../_types/SearchQueryNodeType';
import SearchQueryType from '../../../../_types/SearchQueryType';
import type SearchStateType from '../../../../_types/SearchStateType';

interface GetHandlerInput {
  query: SearchQueryType;
  newId: string;
  activeNode: SearchQueryNodeType | null;
  activeNodeMeta: SearchActiveNodeMetaType | null;
  searchTerm: string;
  rootNode: GroupNodeType | null;
  currentGroupIdx: number;
}

function makeUseQueryChange<InputType = void>(
  getHandler: (
    handlerInput: GetHandlerInput
  ) => (input: InputType) => Partial<SearchStateType> | undefined
) {
  return function useSearchChange(
    method: 'router' | 'memory' | 'href' = 'router'
  ) {
    const pushWindowHash = usePushWindowHash();
    const windowState = useRecoilValue(windowStateAtom);
    const activeNode = useRecoilValue(searchQueryActiveNodeAtom);
    const activeNodeMeta = useRecoilValue(searchQueryActiveNodeMetaAtom);
    const currentGroupIdx =
      activeNodeMeta && activeNodeMeta.type === 'group'
        ? activeNodeMeta.index
        : -1;
    const searchTerm = useRecoilValue(searchQueryTermAtom);
    const rootNode = useRecoilValue(searchQueryRootNodeAtom);
    const [{ query, sort, onlyListed }, setUncommittedState] = useRecoilState(
      searchStateUncommitted
    );

    return (input: InputType) => {
      const nextState = getHandler({
        query,
        newId: nanoid(),
        activeNode,
        activeNodeMeta,
        searchTerm,
        rootNode,
        currentGroupIdx,
      })(input);

      if (!nextState) {
        return;
      }

      const next: SearchStateType = {
        query: nextState.query || query,
        sort: nextState.sort || sort,
        onlyListed:
          nextState.onlyListed === undefined
            ? onlyListed
            : nextState.onlyListed,
      };

      const serialized = serializeSearch(next);
      const nextUrlState: WindowStateType = {
        type: 'search',
        state: serialized,
        tabId: windowState.tabId,
      };

      if (method === 'router') {
        pushWindowHash(nextUrlState);
      }

      if (method === 'memory') {
        setUncommittedState(next);
      }

      return encodeWindowHash(nextUrlState);
    };
  };
}

export default makeUseQueryChange;
