import type { NextApiRequest, NextApiResponse } from 'next';
import type SearchCursorResponseType from '../_types/SearchCursorResponseType';
import postNFTScrollQuery from './_helpers/postNFTScrollQuery';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchCursorResponseType>
) => {
  try {
    const cursor = req.body.cursor as string;
    const result = await postNFTScrollQuery(cursor);

    return res.json({
      cursor: result._scroll_id,
      nfts: result.hits.hits.map((entry) => entry._source),
    });
  } catch (e) {
    return res.status(500).end();
  }
};

export default handler;
