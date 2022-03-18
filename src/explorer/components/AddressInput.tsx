import { TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { parseAddressInput, ParsedAddressInput } from '../../../helpers/utils'

const placeholder =
  'Search for blocks, accounts, transactions, programs, and tokens'

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
