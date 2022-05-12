import { selector } from 'recoil';
import type AttributeQueryNodeType from '../../../_types/AttributeQueryNodeType';
import type QueryNodeType from '../../../_types/QueryNodeType';
import searchStateUncommitted from './searchStateUncommittedAtom';

const isExactAttributeQuery = (
  query: QueryNodeType
): query is AttributeQueryNodeType =>
  'trait' in query && query.field === 'attribute';

const searchQueryAttributesAtom = selector<AttributeQueryNodeType[]>({
  key: 'searchQueryAttributesAtom',
  get: ({ get }) => {
    const { query } = get(searchStateUncommitted);

    const result = query.flat().filter(isExactAttributeQuery);

    return result;
  },
});

export default searchQueryAttributesAtom;
