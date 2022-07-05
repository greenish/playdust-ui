import { enums, Infer, type } from 'superstruct';

const SortFieldEnum = enums([
  'name',
  'relevance',
  'listedPrice',
  'lastSalePrice',
  'rarityScore',
]);

const SortDirectionEnum = enums(['asc', 'desc']);

type SearchSortType = Infer<typeof SearchSortType>;
const SearchSortType = type({
  field: SortFieldEnum,
  direction: SortDirectionEnum,
});

export default SearchSortType;
