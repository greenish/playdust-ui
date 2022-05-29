import { useRecoilState, useRecoilValue } from 'recoil';
import ComposedQueryType from '../../../_types/ComposedQueryType';
import windowStateAtom from '../../_atoms/windowStateAtom';
import encodeWindowHash from '../../_helpers/encodeWindowHash';
import usePushWindowHash from '../../_hooks/usePushWindowHash';
import type { WindowStateType } from '../../_types/WindowStateType';
import searchStateUncommitted from '../_atoms/searchStateUncommittedAtom';
import serializeSearch from '../_helpers/serializeSearch';
import type SearchStateType from '../_types/SearchStateType';

function makeUseQueryChange<T>(
  getHandler: (
    currQuery: ComposedQueryType
  ) => (input: T) => Partial<SearchStateType>
) {
  return function useSearchChange(
    method: 'router' | 'memory' | 'href' = 'router'
  ) {
    const pushWindowHash = usePushWindowHash();
    const windowState = useRecoilValue(windowStateAtom);
    const [{ query, sort, onlyListed }, setUncommittedState] = useRecoilState(
      searchStateUncommitted
    );
    return (input: T) => {
      const nextState = getHandler(query)(input);

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
