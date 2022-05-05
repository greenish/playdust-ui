import { nanoid } from 'nanoid';
import ComposedQueryType from '../../../_types/ComposedQueryType';
import SearchSortType, { isSearchSort } from '../../../_types/SearchSortType';
import type { SearchStateType } from '../_atoms/searchState';
import queryValidationPredicate from './queryValidationPredicate';

const parseQuery = (
  nextState: ComposedQueryType
): ComposedQueryType | never => {
  const isValid = nextState.flat().every(queryValidationPredicate);
  const query = nextState as ComposedQueryType;
  const cleaned = query.map((parent) =>
    parent.map((child) => ({
      ...child,
      id: nanoid(),
    }))
  );

  if (!isValid) {
    throw new Error('Unable to parse search query');
  }

  return cleaned;
};

const parseOnlyListed = (onlyListed: unknown) => {
  try {
    if (typeof onlyListed === 'boolean') {
      return onlyListed;
    }

    return undefined;
  } catch {
    return undefined;
  }
};

const parseSort = (sort: SearchSortType) => {
  try {
    return isSearchSort(sort) ? sort : undefined;
  } catch {
    return undefined;
  }
};

const parseSearch = (input: string): SearchStateType => {
  const { query, onlyListed, sort } = JSON.parse(input);

  const parsedQuery = parseQuery(query);
  const parsedOnlyListed = parseOnlyListed(onlyListed);
  const parsedSort = parseSort(sort);

  return {
    query: parsedQuery,
    onlyListed: parsedOnlyListed,
    sort: parsedSort,
  };
};

export default parseSearch;
