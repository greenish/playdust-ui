import { selectorFamily } from 'recoil';
import type QueryNodeType from '../../../../../../_types/QueryNodeType';
import searchStateUncommitted from '../../../../_atoms/searchStateUncommittedAtom';

const searchQueryChildAtom = selectorFamily<QueryNodeType, string>({
  key: 'searchQueryChildAtom',
  get:
    (id) =>
    ({ get }) => {
      const { query } = get(searchStateUncommitted);
      const found = query
        .flatMap((parent) => parent)
        .find((child) => child.id === id) as QueryNodeType;

      return found;
    },
});

export default searchQueryChildAtom;
