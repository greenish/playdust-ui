import { WindowUnionType } from '../../../_types/WindowUnionType';
import GroupNodeType from '../../_types/GroupNodeType';

type SearchSuggestionType =
  | {
      key: string;
      group: 'Search' | 'Attribute Value' | 'Attribute Trait' | 'No Results';
      label: string;
    }
  | {
      key: string;
      group: 'Attribute';
      label: string;
      attributeMeta: {
        key: string;
        value: string;
      };
    }
  | {
      key: string;
      group: 'Collections';
      label: string;
      collectionId: string;
    }
  | {
      key: string;
      type: WindowUnionType;
      group: 'Explorer';
      label: string;
      meta: string;
    }
  | {
      key: string;
      label: string;
      group: 'Group';
      endIdx: number;
      operator: GroupNodeType['operator'];
    };

export default SearchSuggestionType;
