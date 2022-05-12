import { selector } from 'recoil';
import type TopCollectionsResponseType from '../../../../../_types/TopCollectionsResponseType';
import frontendApi from '../../../_helpers/frontendApi';

const topCollectionsBaseAtom = selector<TopCollectionsResponseType>({
  key: 'topCollectionsBaseAtom',
  get: async () => {
    const { data } = await frontendApi.post<TopCollectionsResponseType>(
      '/top-collections'
    );

    return data;
  },
});

export default topCollectionsBaseAtom;
