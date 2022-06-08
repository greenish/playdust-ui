import SearchQueryType from '../_types/SearchQueryType';
import type SearchStateType from '../_types/SearchStateType';

const serializeSearch = (state: SearchStateType) => {
  const { query, sort, onlyListed } = state;

  if (!SearchQueryType.is(query)) {
    return '';
  }

  const raw = {
    query,
    sort,
    onlyListed,
  };

  return JSON.stringify(raw);
};

export default serializeSearch;
