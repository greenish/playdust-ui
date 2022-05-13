import type OpenSearchCollectionSourceType from '../_types/OpenSearchCollectionSourceType';
import nextApiHandler from './_helpers/nextApiHandler';
import postCollectionQuery from './_helpers/postCollectionQuery';

const getCollectionsByIds = nextApiHandler<OpenSearchCollectionSourceType[]>(
  async (req) => {
    const ids = req.body as string[];

    const esQuery = {
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

    const response = await postCollectionQuery(esQuery);
    const results = response.hits.hits.map((entry) => entry._source);

    return results;
  }
);

export default getCollectionsByIds;
