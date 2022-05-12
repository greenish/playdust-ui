import { selector } from 'recoil';
import searchQueryNoRanges from './searchQueryNoRangesAtom';

const isCollectionQueryAtom = selector<boolean>({
  key: 'isCollectionQueryAtom',
  get: ({ get }) => {
    const queryValid = get(searchQueryNoRanges);
    const firstParent = queryValid[0];

    return firstParent?.length === 1 && firstParent[0].field === 'collection';
  },
});

export default isCollectionQueryAtom;
