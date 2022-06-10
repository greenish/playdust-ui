import { selector } from 'recoil';
import searchStateAtom from '../../../../_atoms/searchStateAtom';
import api from '../../../../_helpers/frontendApi';
import CollectionQueryNodeType from '../../../../_types/CollectionQueryNodeType';
import playdustNftDataAtom from '../../../Address/SPLTokenMintNonFungible/_atoms/playdustNftDataAtom';
import type CollectionOverviewResponseType from '../_types/CollectionOverviewResponseType';

const collectionIdAtom = selector<string | null>({
  key: 'collectionIdAtom',
  get: ({ get }) => {
    const nft = get(playdustNftDataAtom);

    if (nft?.playdustCollection?.id) {
      return nft.playdustCollection.id;
    }

    const { query } = get(searchStateAtom);

    const collectionNodes = Object.values(query.nodes).filter((entry) =>
      CollectionQueryNodeType.is(entry)
    );
    const firstNode = collectionNodes[0];

    if (collectionNodes.length === 1 && CollectionQueryNodeType.is(firstNode)) {
      return firstNode.value;
    }

    return null;
  },
});

const collectionOverviewAtom = selector<CollectionOverviewResponseType | null>({
  key: 'collectionOverviewAtom',
  get: async ({ get }) => {
    const collectionId = get(collectionIdAtom);

    if (collectionId) {
      const { data } = await api.get<CollectionOverviewResponseType>(
        `/collection-overview?id=${collectionId}`
      );

      return data;
    }

    return null;
  },
});

export default collectionOverviewAtom;
