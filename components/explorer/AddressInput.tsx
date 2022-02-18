import { TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'

const placeholder =
  'Search for blocks, accounts, transactions, programs, and tokens'

function validateEthTxHash(str?: string): boolean {
  if (!str) return false
  return /^0x([A-Fa-f0-9]{64})$/.test(str)
}

type SearchType = 'account' | 'block' | 'tx'

function getSearchType(str: string): SearchType {
  if (validateEthTxHash(str) || str.length === 88 || str.length === 87) {
    return 'tx'
  } else if (!str.match(/\D/)) {
    return 'block'
  }
  return 'account'
}

interface ParsedAddressInput {
  query: string
  filter: SearchType
}

function parseAddressInput(str: string): ParsedAddressInput {
  return { query: str, filter: getSearchType(str) }
}

export const AddressInput = () => {
  const router = useRouter()
  const [search, setSearch] = useState<ParsedAddressInput | undefined>()

  function handleInput({ target }: any) {
    const searchString = target.value.trim()

    setSearch(parseAddressInput(searchString))
  }

  function handleKeyPress(e: any) {
    if (e.key === 'Enter') {
      doSearch()
    }
  }

  function doSearch() {
    if (!search) {
      return
    }

    const { filter, query } = search

    router.push(`/${filter}/${query.trim()}`)
  }

  return (
    <TextField
      variant="filled"
      placeholder={placeholder}
      onInput={handleInput}
      onKeyPress={handleKeyPress}
      fullWidth
    />
  )
}
