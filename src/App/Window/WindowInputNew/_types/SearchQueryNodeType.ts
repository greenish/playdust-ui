import { Infer, union } from 'superstruct';
import QueryNodeType from '../../../../_types/QueryNodeType';
import GroupNodeType from './GroupNodeType';

type SearchQueryNodeType = Infer<typeof SearchQueryNodeType>;
const SearchQueryNodeType = union([GroupNodeType, QueryNodeType]);

export default SearchQueryNodeType;
