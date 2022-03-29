import retry from 'async-retry'
import fastq from 'fastq'
import fs from 'fs'
import path from 'path'
import { cannedCollections, fetchOffchain, fetchOnchain } from '../solana'

const OUTPUT_DIR = path.join(__dirname, '..', 'public/data')
const ARWEAVE_CONCURRENCY_LIMIT = 500

const worker = async (uri: string): Promise<{}> => {
  return retry(() => fetchOffchain(uri), {
    minTimeout: 5000,
  })
}

const queue = fastq.promise(worker, ARWEAVE_CONCURRENCY_LIMIT)

const getOutputPath = (symbol: string) =>
  path.join(OUTPUT_DIR, `${symbol}.json`)

const run = async () => {
  const collectionPromises = cannedCollections
    .filter((collection) => !fs.existsSync(getOutputPath(collection.symbol)))
    .map(async (collection) => {
      let count = 0
      const onchain = await fetchOnchain.byCollection(collection)

      const offchainPromises = onchain.map(async (meta) => {
        const { uri } = meta.onchain.data
        const offchain = await queue.push(uri)

        return {
          ...meta,
          offchain,
        }
      })

      const payload = await Promise.all(offchainPromises)

      fs.writeFileSync(
        getOutputPath(collection.symbol),
        JSON.stringify(payload)
      )
    })

  await Promise.all(collectionPromises)
}

run()
