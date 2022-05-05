import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import type SearchCursorResponseType from '../../../../../_types/SearchCursorResponseType';
import api from '../../../../_helpers/frontendApi';
import searchResultsBase from '../../../_atoms/searchResultsBase';
import searchResultsMore from '../../../_atoms/searchResultsMore';

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
