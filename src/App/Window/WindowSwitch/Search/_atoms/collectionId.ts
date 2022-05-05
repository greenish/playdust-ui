import { selector } from 'recoil';
import isCollectionQueryAtom from '../../../_atoms/isCollectionQuery';
import searchQueryNoRanges from '../../../_atoms/searchQueryNoRanges';

const collectionId = selector<string>({
  key: 'collectionId',
  get: ({ get }) => {
    const isCollectionQuery = get(isCollectionQueryAtom);

    if (!isCollectionQuery) {
      return '';
    }
    const query = get(searchQueryNoRanges);

    return (query[0][0].value as string) || '';
  },
});

export default collectionId;
