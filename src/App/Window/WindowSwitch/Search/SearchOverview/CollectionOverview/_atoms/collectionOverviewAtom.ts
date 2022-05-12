import { selectorFamily } from 'recoil';
import type CollectionOverviewResponseType from '../../../../../../../_types/CollectionOverviewResponseType';
import api from '../../../../../_helpers/frontendApi';

const collectionOverviewAtom = selectorFamily<
  CollectionOverviewResponseType,
  string
>({
  key: 'collectionOverviewAtom',
  get: (id: string) => async () => {
    const { data } = await api.get<CollectionOverviewResponseType>(
      `/collection-overview?id=${id}`
    );

    return data;
  },
});

export default collectionOverviewAtom;
