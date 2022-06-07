import { useRecoilValue, useSetRecoilState } from 'recoil';
import encodeWindowHash from '../../_helpers/encodeWindowHash';
import usePushWindowHash from '../../_hooks/usePushWindowHash';
import type { WindowStateType } from '../../_types/WindowStateType';
import searchStateSerializedAtom from '../_atoms/searchStateSerializedAtom';
import searchStateUncommittedAtom from '../_atoms/searchStateUncommittedAtom';
import windowStateAtom from '../_atoms/windowStateAtom';
import parseSearch from '../_helpers/parseSearch';
import serializeSearch from '../_helpers/serializeSearch';
import type ChangeSearchQueryMethodType from '../_types/ChangeSearchQueryMethodType';
import type SearchStateType from '../_types/SearchStateType';

function makeUseChangeSearchQuery<GetNextStateArgs extends unknown[]>(
  useGetNextState: () => (
    ...input: GetNextStateArgs
  ) => Partial<SearchStateType> | void
) {
  return (method: ChangeSearchQueryMethodType = 'router') => {
    const pushWindowHash = usePushWindowHash();
    const windowState = useRecoilValue(windowStateAtom);
    const serialized = useRecoilValue(searchStateSerializedAtom);
    const { query, sort, onlyListed } = parseSearch(serialized)
    const setUncommittedState = useSetRecoilState(searchStateUncommittedAtom)
    const getNextState = useGetNextState();

    return (...input: GetNextStateArgs) => {
      const nextState = getNextState(...input);

      if (!nextState) {
        return '';
      }

      const next: SearchStateType = {
        query: nextState.query || query,
        sort: nextState.sort || sort,
        onlyListed:
          nextState.onlyListed === undefined
            ? onlyListed
            : nextState.onlyListed,
      };

      const serializedNext = serializeSearch(next);

      const nextUrlState: WindowStateType = {
        type: 'search',
        state: serializedNext,
        tabId: windowState.tabId,
      };

      if (serialized !== serializedNext && method === 'router') {
        pushWindowHash(nextUrlState);
      }

      if (method === 'memory') {
        setUncommittedState(next);
      }

      return encodeWindowHash(nextUrlState);
    };
  };
}

export default makeUseChangeSearchQuery;
