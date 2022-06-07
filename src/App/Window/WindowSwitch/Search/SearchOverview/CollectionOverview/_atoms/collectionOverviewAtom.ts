import { selector } from 'recoil';
import searchStateAtom from '../../../../../_atoms/searchStateAtom';
import api from '../../../../../_helpers/frontendApi';
import CollectionQueryNodeType from '../../../../../_types/CollectionQueryNodeType';
import type CollectionOverviewResponseType from '../_types/CollectionOverviewResponseType';

const collectionOverviewAtom = selector<CollectionOverviewResponseType | null>({
  key: 'collectionOverviewAtom',
  get: async ({ get }) => {
    const { query } = get(searchStateAtom);

    const collectionNodes = Object.values(query.nodes).filter((entry) =>
      CollectionQueryNodeType.is(entry)
    );
    const firstNode = collectionNodes[0];

    if (collectionNodes.length === 1 && CollectionQueryNodeType.is(firstNode)) {
      const { data } = await api.get<CollectionOverviewResponseType>(
        `/collection-overview?id=${firstNode.value}`
      );

      return data;
    }

    return null;
  },
});

export default collectionOverviewAtom;
