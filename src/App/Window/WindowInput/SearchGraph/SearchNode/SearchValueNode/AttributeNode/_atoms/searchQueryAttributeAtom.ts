import { selectorFamily } from 'recoil';
import type AttributeQueryNodeType from '../../../../../../../../_types/AttributeQueryNodeType';
import searchQueryAttributes from '../../../../../../_atoms/searchQueryAttributesAtom';

const searchQueryAttributeAtom = selectorFamily<
  AttributeQueryNodeType | undefined,
  string
>({
  key: 'searchQueryAttributeAtom',
  get:
    (id) =>
    ({ get }) => {
      const attributes = get(searchQueryAttributes);
      const result = attributes.find((entry) => entry.id === id);

      return result;
    },
});

export default searchQueryAttributeAtom;
