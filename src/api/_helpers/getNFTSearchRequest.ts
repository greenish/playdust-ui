import type {
  SearchRequest,
  SearchSort,
} from '@opensearch-project/opensearch/api/types';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import type SearchQueryType from '../../App/Window/_types/SearchQueryType';
import SearchSortType from '../../App/Window/_types/SearchSortType';
import getNFTQueryById from './getNFTQueryById';

type GetNFTQueryByIdOptionsType = {
  sort?: SearchSortType;
  onlyListed?: boolean;
  size?: number;
  from?: number;
};

const getSort = (sort: SearchSortType): SearchSort | undefined => {
  switch (sort.field) {
    case 'name':
      return [
        {
          'offChainData.name.sort': sort.direction,
        },
      ];
    case 'list-price':
      return [
        {
          lastListPrice: sort.direction,
        },
      ];
    case 'sale-price':
      return [
        {
          lastTradePrice: sort.direction,
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

const buildQuery = (
  query: SearchQueryType,
  onlyListed: boolean,
  isRelevanceSort: boolean
) => {
  const baseQuery = getNFTQueryById(query, query.rootId);

  const osQuery: QueryDslQueryContainer = onlyListed
    ? {
        bool: {
          must: [
            {
              term: {
                listed: true,
              },
            },
            baseQuery,
          ],
        },
      }
    : baseQuery;

  const wrappedQuery: QueryDslQueryContainer = {
    bool: {
      [isRelevanceSort ? 'must' : 'filter']: osQuery,
    },
  };

  return wrappedQuery;
};

const getNFTSearchRequest = (
  query: SearchQueryType,
  options?: GetNFTQueryByIdOptionsType
): SearchRequest['body'] => {
  const onlyListed = Boolean(options?.onlyListed);
  const isRelevanceSort = options?.sort?.field === 'relevance';

  return {
    query: buildQuery(query, onlyListed, isRelevanceSort),
    sort: options?.sort && getSort(options.sort),
    size: options?.size,
    from: options?.from,
  };
};

export default getNFTSearchRequest;
