import { selectorFamily } from 'recoil';
import type QueryNodeType from '../../../_types/QueryNodeType';
import searchStateUncommitted from './searchStateUncommitted';

const searchQueryChild = selectorFamily<QueryNodeType, string>({
  key: 'searchQueryChild',
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

export default searchQueryChild;
