import { useRecoilState, useRecoilValue } from 'recoil';
import encodeWindowHash from '../../_helpers/encodeWindowHash';
import usePushWindowHash from '../../_hooks/usePushWindowHash';
import type { WindowStateType } from '../../_types/WindowStateType';
import searchStateUncommitted from '../_atoms/searchStateUncommittedAtom';
import windowStateAtom from '../_atoms/windowStateAtom';
import serializeSearch from '../_helpers/serializeSearch';
import type ChangeSearchQueryMethodType from '../_types/ChangeSearchQueryMethodType';
import type SearchStateType from '../_types/SearchStateType';

const useChangeSearchQuery = (
  method: ChangeSearchQueryMethodType = 'router'
) => {
  const pushWindowHash = usePushWindowHash();
  const windowState = useRecoilValue(windowStateAtom);
  const [{ query, sort, onlyListed }, setUncommittedState] = useRecoilState(
    searchStateUncommitted
  );

  return (
    input: Partial<SearchStateType> | (() => Partial<SearchStateType> | null)
  ) => {
    const nextState = typeof input === 'function' ? input() : input;

    if (!nextState) {
      return '';
    }

    const next: SearchStateType = {
      query: nextState.query || query,
      sort: nextState.sort || sort,
      onlyListed:
        nextState.onlyListed === undefined ? onlyListed : nextState.onlyListed,
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

export default useChangeSearchQuery;
