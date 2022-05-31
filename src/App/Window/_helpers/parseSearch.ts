import { nanoid } from 'nanoid';
import isInSearchSortUnion from '../../../_helpers/isInSearchSortUnion';
import ComposedQueryType from '../../../_types/ComposedQueryType';
import SearchSortType from '../../../_types/SearchSortUnionType';
import type SearchStateType from '../_types/SearchStateType';
import queryValidationPredicate from './queryValidationPredicate';

const parseQuery = (nextState: ComposedQueryType): ComposedQueryType => {
  const isValid = nextState.flat().every(queryValidationPredicate);
  const query = nextState;
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

const parseSort = (sort: SearchSortType | undefined) => {
  try {
    return sort && isInSearchSortUnion(sort) ? sort : undefined;
  } catch {
    return undefined;
  }
};

const parseSearch = (input: string): SearchStateType => {
  try {
    const { query, onlyListed, sort } = JSON.parse(input) as SearchStateType;

    const parsedQuery = parseQuery(query);
    const parsedOnlyListed = parseOnlyListed(onlyListed);
    const parsedSort = parseSort(sort);

    return {
      query: parsedQuery,
      onlyListed: parsedOnlyListed,
      sort: parsedSort,
    };
  } catch {
    return {
      query: [],
    };
  }
};

export default parseSearch;
