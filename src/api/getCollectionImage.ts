import { SearchRequest } from '@opensearch-project/opensearch/api/types';
import axios, { AxiosPromise } from 'axios';
import sharp from 'sharp';
import nextApiHandler from './_helpers/nextApiHandler';
import searchNFTs from './_helpers/searchNFTs';

const cdnBase = 'https://cdn.playdust.dev/api/image/';

const getCollectionImage = nextApiHandler<Buffer>(async (req, res) => {
  const collectionId = req.query.id;
  const sizeString = req.query.s;

  if (typeof collectionId !== 'string' || typeof sizeString !== 'string') {
    throw new Error(`Invalid collectionId "id" or size "s" supplied`);
  }

  const size = parseInt(sizeString, 10);

  const halfSize = size / 2;

  const baseImage = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  });

  try {
    const query: SearchRequest['body'] = {
      query: {
        bool: {
          filter: [
            {
              nested: {
                path: 'collections',
                query: {
                  term: {
                    'collections.id': collectionId,
                  },
                },
              },
            },
            {
              exists: {
                field: 'image',
              },
            },
          ],
        },
      },
      sort: [
        {
          rarityScore: 'asc',
        },
      ],
      size: 4,
    };
    const [result] = await searchNFTs([{ body: query }]);
    const images = result.sources.map((entry) => entry.image);

    const cdnPaths = images.map(
      (image) =>
        `${cdnBase}?url=${encodeURIComponent(image)}&d=${halfSize}x${halfSize}`
    );
    const cdnFetches = cdnPaths.map((path) =>
      axios({
        url: path,
        responseType: 'arraybuffer',
      })
    );
    const results = await Promise.all<AxiosPromise<ArrayBuffer>>(cdnFetches);
    const buffers = results.map((entry) => entry.data) as Buffer[];

    const output = await baseImage
      .composite(
        [
          {
            input: buffers[0],
            top: 0,
            left: 0,
          },
          {
            input: buffers[1],
            top: 0,
            left: halfSize,
          },
          {
            input: buffers[2],
            top: halfSize,
            left: 0,
          },
          {
            input: buffers[3],
            top: halfSize,
            left: halfSize,
          },
        ].filter((entry) => !!entry.input)
      )
      .sharpen()
      .png()
      .toBuffer();

    res.setHeader('Cache-Control', 'max-age=86400, s-maxage=86400');

    return output;
  } catch (e) {
    return await baseImage.png().toBuffer();
  }
});

export default getCollectionImage;
