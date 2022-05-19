import type { WindowUnionType } from '../../../_types/WindowUnionType';

interface SearchSuggestionType {
  key: string;
  type: WindowUnionType;
  group:
    | 'Search'
    | 'Explorer'
    | 'Collections'
    | 'Attribute'
    | 'Attribute Value'
    | 'Attribute Trait';
  label: string;
  meta?: string;
  attributeMeta?: {
    trait: string;
    option: string;
  };
}

export default SearchSuggestionType;
