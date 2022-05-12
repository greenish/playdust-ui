import { selectorFamily } from 'recoil';
import type RangeQueryNodeType from '../../../../../../../_types/RangeQueryNodeType';
import searchQueryValid from '../../../../../_atoms/searchQueryValidAtom';

const rangeQueryByNameAtom = selectorFamily<
  RangeQueryNodeType | undefined,
  string
>({
  key: 'rangeQueryByNameAtom',
  get:
    (name: string) =>
    ({ get }) => {
      const query = get(searchQueryValid);
      const flat = query.flat();
      const found = flat.find(
        (child) => child.field === 'range' && child.value === name
      );

      if (found) {
        return found as RangeQueryNodeType;
      }

      return found;
    },
});

export default rangeQueryByNameAtom;
