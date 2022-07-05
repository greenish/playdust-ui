import { selector } from 'recoil';
import api from '../../_helpers/frontendApi';
import type CollectionOverviewResponseType from '../_types/CollectionOverviewResponseType';
import playdustNftDataAtom from './playdustNftDataAtom';
import searchStateAtom from './searchStateAtom';
import searchTopAggregationAtom from './searchTopAggregationAtom';

const collectionIdAtom = selector<string | null>({
  key: 'collectionIdAtom',
  get: ({ get }) => {
    const nft = get(playdustNftDataAtom);

    if (nft?.playdustCollection?.id) {
      return nft.playdustCollection.id;
    }

    const topAggs = get(searchTopAggregationAtom);

    if (topAggs.collections.length === 1) {
      return topAggs.collections[0].id;
    }

    return null;
  },
});

const collectionOverviewAtom = selector<CollectionOverviewResponseType | null>({
  key: 'collectionOverviewAtom',
  get: async ({ get }) => {
    const collectionId = get(collectionIdAtom);
    const { query } = get(searchStateAtom);

    if (query.rootId === '') {
      return null;
    }

    if (collectionId) {
      try {
        const { data } = await api.get<CollectionOverviewResponseType>(
          `/collection-overview?id=${collectionId}`
        );
        return data;
      } catch (e) {
        return null;
      }
    }

    return null;
  },
});

export default collectionOverviewAtom;
