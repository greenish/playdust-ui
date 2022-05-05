import type { NextApiRequest, NextApiResponse } from 'next';
import type OpenSearchCollectionSourceType from '../_types/OpenSearchCollectionSourceType';
import postCollectionQuery from './_helpers/postCollectionQuery';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<OpenSearchCollectionSourceType[]>
) => {
  try {
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

    res.json(results);
  } catch (e) {
    res.status(500).end();
  }
};

export default handler;
