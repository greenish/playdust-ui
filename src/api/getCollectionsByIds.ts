import { array, string } from 'superstruct';
import OpenSearchCollectionSourceType from '../App/Window/_types/OpenSearchCollectionSourceType';
import nextApiHandler from './_helpers/nextApiHandler';
import searchCollections from './_helpers/searchCollections';

const CollectionByIds = array(string());

const getCollectionsByIds = nextApiHandler<OpenSearchCollectionSourceType[]>(
  async (req) => {
    const ids = CollectionByIds.create(req.body);

    const osBody = {
      size: ids.length,
      query: {
        bool: {
          filter: {
            ids: {
              values: ids,
            },
          },
        },
      },
    };

    const [results] = await searchCollections([{ body: osBody }]);

    return results.sources;
  }
);

export default getCollectionsByIds;
