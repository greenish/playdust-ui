import { array, Infer, number, string, type } from 'superstruct';
import SearchAggResponseType from '../../../../_types/SearchAggResponseType';

type SearchTopAggResponseType = Infer<typeof SearchTopAggResponseType>;
const SearchTopAggResponseType = type({
  attributes: SearchAggResponseType,
  collections: array(
    type({
      id: string(),
      name: string(),
      count: number(),
    })
  ),
});

export default SearchTopAggResponseType;
