const queriesToMultiSearch = (
  queries: object[],
  index: 'nft-collection' | 'nft-metadata'
) =>
  queries
    .flatMap((entry) => [
      `{ "index": "${index}"}\n`,
      `${JSON.stringify(entry)}\n`,
    ])
    .join('');

export default queriesToMultiSearch;
