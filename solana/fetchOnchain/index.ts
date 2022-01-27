import byCollection from './byCollection'
import byOwner from './byOwner'
import byMintAddress from './byMintAddress'
import getTransactions from './getTransactions'

const fetchOnchain = {
  byCollection,
  byOwner,
  byMintAddress,
  getTransactions,
}

export default fetchOnchain
