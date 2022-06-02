import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import SearchAggregationResponseType from '../../../../../../../_types/SearchAggregationResponseType';
import searchAggregationsAtom from '../../../../../_atoms/searchAggregationsAtom';
import searchStateSerializedAtom from '../../../../../_atoms/searchStateSerializedAtom';
import frontendApi from '../../../../../_helpers/frontendApi';
import parseSearch from '../../../../../_helpers/parseSearch';

function useSearchAggregations(): [
  SearchAggregationResponseType,
  () => Promise<void>
] {
  const [searchAggregation, setSearchAggregation] = useRecoilState(
    searchAggregationsAtom
  );
  const serialized = useRecoilValue(searchStateSerializedAtom);
  const parsed = parseSearch(serialized);

  const updateSearchAggregations = useCallback(async () => {
    if (!parsed) {
      return;
    }

    const { data } = await frontendApi.post<SearchAggregationResponseType>(
      '/search-aggregations',
      parsed
    );

    setSearchAggregation(data);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized]);

  return [searchAggregation, updateSearchAggregations];
}

export default useSearchAggregations;
