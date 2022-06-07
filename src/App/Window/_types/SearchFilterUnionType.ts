import { enums, Infer } from 'superstruct';

type SearchFilterUnionType = Infer<typeof SearchFilterUnionType>;
const SearchFilterUnionType = enums([
  'list-price',
  'sale-price',
  'rarity-score',
]);

export default SearchFilterUnionType;
