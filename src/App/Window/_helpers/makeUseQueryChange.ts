import { useRecoilState } from 'recoil';
import ComposedQueryType from '../../../_types/ComposedQueryType';
import { WindowType } from '../../_atoms/appState';
import encodeWindowHash from '../../_helpers/encodeWindowHash';
import usePushWindowHash from '../../_hooks/usePushWindowHash';
import type { SearchStateType } from '../_atoms/searchState';
import searchStateUncommitted from '../_atoms/searchStateUncommitted';
import serializeSearch from './serializeSearch';

function makeUseQueryChange<T>(
  getHandler: (
    currQuery: ComposedQueryType
  ) => (input: T) => Partial<SearchStateType>
) {
  return function useSearchChange(
    method: 'router' | 'memory' | 'href' = 'router'
  ) {
    const pushWindowHash = usePushWindowHash();
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
      const nextUrlState: WindowType = { type: 'search', state: serialized };

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
