import { selector } from 'recoil';
import isCollectionQueryAtom from '../../../../_atoms/isCollectionQueryAtom';
import searchQueryNoRanges from '../../../../_atoms/searchQueryNoRangesAtom';

const collectionIdAtom = selector<string>({
  key: 'collectionIdAtom',
  get: ({ get }) => {
    const isCollectionQuery = get(isCollectionQueryAtom);

    if (!isCollectionQuery) {
      return '';
    }
    const query = get(searchQueryNoRanges);

    return (query[0][0].value as string) || '';
  },
});

export default collectionIdAtom;
