const queriesToMultiSearch = (
  queries: object[],
  index: 'nft-collection' | 'nft-metadata'
) =>
  queries
    .flatMap((entry) => {
      return [`{ "index": "${index}"}\n`, `${JSON.stringify(entry)}\n`]
    })
    .join('')

export default queriesToMultiSearch
