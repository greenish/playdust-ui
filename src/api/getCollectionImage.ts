import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'
import postNFTQuery from './_helpers/postNFTQuery'

const cdnBase = 'https://cdn.playdust.dev/api/image/'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const collectionId = req.query.id as string
  const size = parseInt(req.query.s as string)
  const halfSize = size / 2

  const baseImage = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })

  try {
    const query = {
      query: {
        bool: {
          filter: [
            {
              terms: {
                heuristicCollectionId: [collectionId],
              },
            },
            {
              exists: {
                field: 'offChainData.image',
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
    }
    const result = await postNFTQuery(query)
    const images = result.hits.hits.map(
      (entry) => entry._source.offChainData.image
    )

    const cdnPaths = images.map(
      (image) =>
        `${cdnBase}?url=${encodeURIComponent(image)}&d=${halfSize}x${halfSize}`
    )
    const cdnFetches = cdnPaths.map((path) =>
      axios({
        url: path,
        responseType: 'arraybuffer',
      })
    )
    const results = await Promise.all(cdnFetches)
    const buffers = results.map((entry) => entry.data) as Buffer[]

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
      .toBuffer()

    res.setHeader('Cache-Control', 'max-age=86400, s-maxage=86400')
    res.json(output)
  } catch (e) {
    res.json(await baseImage.png().toBuffer())
  }
}

export default handler
