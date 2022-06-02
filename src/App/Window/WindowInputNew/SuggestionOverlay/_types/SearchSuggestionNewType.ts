import { WindowUnionType } from '../../../../_types/WindowUnionType';

interface SearchSuggestionNewType {
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
    key: string;
    value: string;
  };
  selected?: boolean;
}

export default SearchSuggestionNewType;
