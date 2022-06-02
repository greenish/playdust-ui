import { atom } from 'recoil';
import type SearchAggregationResponseType from '../../../_types/SearchAggregationResponseType';
import searchAggregationsLiveAtom from './searchAggregationsLiveAtom';

const searchAggregationsAtom = atom<SearchAggregationResponseType>({
  key: 'searchAggregationsAtom',
  default: searchAggregationsLiveAtom,
});

export default searchAggregationsAtom;
