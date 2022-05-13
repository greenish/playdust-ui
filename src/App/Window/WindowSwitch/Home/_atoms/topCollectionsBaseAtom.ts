import { selector } from 'recoil';
import type TopCollectionsResponseType from '../../../../../_types/TopCollectionsResponseType';
import fetchTopCollections from '../_helpers/fetchTopCollections';

const topCollectionsBaseAtom = selector<TopCollectionsResponseType>({
  key: 'topCollectionsBaseAtom',
  get: async () => fetchTopCollections(0),
});

export default topCollectionsBaseAtom;
