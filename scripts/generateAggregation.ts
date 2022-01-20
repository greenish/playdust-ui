import path from 'path'
import fs from 'fs'
import { cannedCollections } from '../solana'
import { ParsedMetadata } from '../solana/types'

const INPUT_DIR = path.join(__dirname, '..', 'public/data')

const getAttributes = (data: ParsedMetadata[]) => {
  const attributesMap = data
    .flatMap(entry => entry.offchain.attributes)
    .reduce((acc: any, curr: any) => {
      if (!curr) {
        return acc
      }

      const { trait_type, value } = curr
      const currentArr = acc[trait_type]

      if (trait_type === 'sequence') {
        return acc
      }

      if (!currentArr) {
        return {
          ...acc,
          [trait_type]: [value]
        }
      }

      if (currentArr.includes(value)) {
        return acc
      }

      return {
        ...acc,
        [trait_type]: [...currentArr, value],
      }
    }, {})

  return Object.entries(attributesMap).map((entry: any) => ({
    trait: entry[0],
    options: entry[1],
  }))
}

cannedCollections.map(collection => {
  const inputFile = path.join(INPUT_DIR, `${collection.symbol}.json`)
  const input = JSON.parse(fs.readFileSync(inputFile, 'utf8'))

  const agg = {
    count: input.length,
    attributes: getAttributes(input),
  }

  fs.writeFileSync(
    path.join(INPUT_DIR, `${collection.symbol}-AGGREGATION.json`),
    JSON.stringify(agg),
  )
})
