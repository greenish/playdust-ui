import {
  cannedCollections,
  fetchOnchain,
  fetchOffchain,
} from '../solana'
import fastq from 'fastq'
import fs from 'fs'
import path from 'path'
import retry from 'async-retry'

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
    .filter(collection => !fs.existsSync(getOutputPath(collection.symbol)))
    .map(
      async collection => {
        let count = 0
        console.log('fetching onchain data for', collection.symbol)
        const onchain = await fetchOnchain.byCollection(collection)
        console.log('finished fetching onchain data for', collection.symbol)

        const offchainPromises = onchain.map(async meta => {
          const { uri } = meta.onchain.data
          const offchain = await queue.push(uri)
          console.log(`${collection.symbol}: fetched offchain ${++count}/${onchain.length}`)

          return {
            ...meta,
            offchain,
          }
        })

        const payload = await Promise.all(offchainPromises)

        fs.writeFileSync(
          getOutputPath(collection.symbol),
          JSON.stringify(payload),
        )
      }
    )

  await Promise.all(collectionPromises)

  console.log('\n\nFinished')
}

run()
