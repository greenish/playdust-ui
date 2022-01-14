import { GetProgramAccountsFilter } from '@solana/web3.js'
import makeMemFilter from './makeMemFilter'
import { MetaplexCollectionIdentifier } from '../../types'

export const byName = (name: string) =>
  makeMemFilter({ offset: 69, query: name })

export const bySymbol = (symbol: string) =>
  makeMemFilter({ offset: 105, query: symbol })

export const byCreator = (creator: string) =>
  makeMemFilter({ offset: 326, publicKey: creator })

export const byUpdateAuthority = (updateAuthority: string) =>
  makeMemFilter({ offset: 1, publicKey: updateAuthority })

export const byCombination = (filters: MetaplexCollectionIdentifier): GetProgramAccountsFilter[] => {
  const memFilters = []

  memFilters.push(bySymbol(filters.symbol))

  if (filters.name) {
    memFilters.push(byName(filters.name))
  }
  if (filters.creator) {
    memFilters.push(byCreator(filters.creator))
  }
  if (filters.updateAuthority) {
    memFilters.push(byUpdateAuthority(filters.updateAuthority))
  }

  return memFilters
}

const filters =  {
  byName,
  bySymbol,
  byCreator,
  byUpdateAuthority,
  byCombination,
}

export default filters