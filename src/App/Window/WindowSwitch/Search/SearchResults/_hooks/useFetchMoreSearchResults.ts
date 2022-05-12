import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import type SearchCursorResponseType from '../../../../../../_types/SearchCursorResponseType';
import searchResultsBase from '../../../../_atoms/searchResultsBaseAtom';
import searchResultsMore from '../../../../_atoms/searchResultsMoreAtom';
import api from '../../../../_helpers/frontendApi';

const useFetchMoreSearchResults = () => {
  const loadable = useRecoilValueLoadable(searchResultsBase);
  const setter = useSetRecoilState(searchResultsMore);

  return async () => {
    if (loadable.state === 'hasValue') {
      const { cursor } = loadable.contents;

      const { data } = await api.post<SearchCursorResponseType>(
        '/search-cursor',
        {
          cursor,
        }
      );

      setter((curr) => [...curr, ...data.nfts]);
    }
  };
};

export default useFetchMoreSearchResults;
