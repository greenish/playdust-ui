import type {
  QueryDslQueryContainer,
  SearchSort,
} from '@opensearch-project/opensearch/api/types';
import OpenSearchNFTSourceType from '../../App/Window/WindowSwitch/_types/OpenSearchNFTSourceType';
import SearchSortType from '../../App/Window/WindowSwitch/_types/SearchSortType';
import makeSearchOS from './makeSearchOS';

const existsQuery: QueryDslQueryContainer[] = [
  {
    exists: {
      field: 'mint',
    },
  },
  {
    exists: {
      field: 'uri',
    },
  },
  {
    exists: {
      field: 'name',
    },
  },
  {
    exists: {
      field: 'image',
    },
  },
];

const onlyListedQuery: QueryDslQueryContainer[] = [
  {
    exists: {
      field: 'listedPrice',
    },
  },
];

const getSort = (sort: SearchSortType | undefined): SearchSort | undefined => {
  if (!sort) {
    return undefined;
  }

  switch (sort.field) {
    case 'name':
      return [
        {
          'name.sort': sort.direction,
        },
      ];
    case 'list-price':
      return [
        {
          listedPrice: sort.direction,
        },
      ];
    case 'sale-price':
      return [
        {
          lastSalePrice: sort.direction,
        },
      ];
    case 'rarity-score':
      return [
        {
          normalizedRarityScore: sort.direction,
        },
      ];
    case 'relevance':
      return [
        '_score',
        {
          normalizedRarityScore: 'desc',
        },
      ];
    default:
  }
};

type SearchNFTsOptionsType = {
  sort?: SearchSortType;
  onlyListed?: boolean;
};

const searchNFTs = makeSearchOS<OpenSearchNFTSourceType, SearchNFTsOptionsType>(
  'nft-metadata2',
  OpenSearchNFTSourceType,
  (body, { sort, onlyListed } = {}) => {
    const isRelevanceSort = sort?.field === 'relevance';
    const wrappedQuery: QueryDslQueryContainer = {
      bool: {
        [isRelevanceSort ? 'must' : 'filter']: [
          ...existsQuery,
          ...(onlyListed ? onlyListedQuery : []),
          body?.query,
        ],
      },
    };

    return {
      ...body,
      query: wrappedQuery,
      sort: getSort(sort),
    };
  }
);

export default searchNFTs;
