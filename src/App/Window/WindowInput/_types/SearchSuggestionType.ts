import { WindowUnionType } from '../../../_types/WindowUnionType';
import GroupNodeType from '../../_types/GroupNodeType';

type SearchSuggestionType =
  | {
      key: string;
      group: 'Search' | 'No Results';
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
      group: 'Selection';
      action: 'remove';
    }
  | {
      key: string;
      label: string;
      group: 'Selection';
      action: 'group';
      operator: GroupNodeType['operator'];
    };

export default SearchSuggestionType;
