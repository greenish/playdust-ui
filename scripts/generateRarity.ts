import fs from 'fs'
import path from 'path'
import { cannedCollections } from '../solana'
import { ParsedMetadata } from '../solana/types'

const INPUT_DIR = path.join(__dirname, '..', 'public/data')

const getBaseCounts = (attributes: any[]) => {
  const attributeCounts: any = {}

  attributes.forEach((a) => {
    a.forEach((entry: any) => {
      const type = entry.trait_type
      const value = entry.value

      if (!attributeCounts[type]) {
        return (attributeCounts[type] = {
          [value]: 1,
        })
      }

      if (!attributeCounts[type][value]) {
        return (attributeCounts[type] = {
          ...attributeCounts[type],
          [value]: 1,
        })
      }

      return attributeCounts[type][value]++
    })
  })

  return attributeCounts
}

const addRarity = (tokens: ParsedMetadata[]) => {
  const cleanedTokens = tokens.filter((entry) => !!entry.offchain.attributes)
  const attributes = cleanedTokens.map((entry) => entry.offchain.attributes)
  const attributeCounts = getBaseCounts(attributes)

  const result = cleanedTokens.map((token) => {
    const { attributes } = token.offchain

    const rarityPercentages = attributes.reduce<any>((acc, curr) => {
      const count = attributeCounts[curr.trait_type][curr.value]

      if (count === 1 || count === tokens.length) {
        return acc
      }

      const traitRarity = count / tokens.length

      return [...acc, traitRarity]
    }, [])

    const statisticalRarity = rarityPercentages.reduce(
      (acc: number, curr: number) => acc * curr,
      1
    )
    const rarityScore = rarityPercentages.reduce(
      (acc: number, curr: number) => acc + 1 / curr,
      0
    )

    return {
      ...token,
      statisticalRarity,
      rarityScore,
    }
  })

  return result
}

const getUniqueTokensByName = (tokens: ParsedMetadata[]) => {
  const names: any = {}

  return tokens.filter((entry) => {
    const { name } = entry.onchain.data

    if (names[name]) {
      return false
    }

    names[name] = true

    return true
  })
}

cannedCollections.map((collection) => {
  const inputFile = path.join(INPUT_DIR, `${collection.symbol}.json`)
  const allTokens = JSON.parse(fs.readFileSync(inputFile, 'utf8'))
  const tokens = getUniqueTokensByName(allTokens)

  const withRarity = addRarity(tokens)

  fs.writeFileSync(
    path.join(INPUT_DIR, `${collection.symbol}-RANKED.json`),
    JSON.stringify(withRarity)
  )
})
