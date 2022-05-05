import { selectorFamily } from 'recoil';
import type AttributeQueryNodeType from '../../../_types/AttributeQueryNodeType';
import searchQueryAttributes from './searchQueryAttributes';

const searchQueryAttribute = selectorFamily<
  AttributeQueryNodeType | undefined,
  string
>({
  key: 'searchQueryAttribute',
  get:
    (id) =>
    ({ get }) => {
      const attributes = get(searchQueryAttributes);
      const result = attributes.find((entry) => entry.id === id);

      return result;
    },
});

export default searchQueryAttribute;
