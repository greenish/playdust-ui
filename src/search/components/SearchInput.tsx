import styled from '@emotion/styled'
import { ManageSearch, Warning } from '@mui/icons-material'
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Tooltip,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { getSearchType } from '../../../helpers/routing'
import * as store from '../store'
import SearchChips from './SearchChips'
import SearchGraph from './SearchGraph'

const RootContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const TextFieldInput = styled(TextField)(() => ({
  '& fieldset': {
    borderRadius: 0,
  },
}))

const SearchInput = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const isQueryValid = useRecoilValue(store.isSearchQueryValid)
  const setSearchQueryValid = store.useSetSearchQueryValid()
  const addText = store.useAddText()
  const clearSearchQuery = store.useClearSearchQuery()
  const searchQueryValid = useRecoilValue(store.searchQueryValid)
  const { state } = useRecoilValueLoadable(store.searchResults)

  useEffect(() => {
    window.addEventListener('beforeunload', setSearchQueryValid)

    return () => {
      window.removeEventListener('beforeunload', setSearchQueryValid)
    }
  }, [])

  const height = useMemo(() => {
    return window.innerHeight * 0.8
  }, [window.innerHeight])

  const handleClose = () => isQueryValid && setOpen(false)
  const disabled = state === 'loading'

  return (
    <RootContainer>
      <Autocomplete
        size={'small'}
        open={searchOpen}
        onOpen={() => setSearchOpen(true)}
        onClose={() => setSearchOpen(false)}
        onChange={(_evt, [_placeholder, value], reason) => {
          if (reason === 'clear') {
            return clearSearchQuery()
          }

          if (!value || !value.length) {
            return
          }

          const searchType = getSearchType(value)

          if (!searchType) {
            addText(value, 'and')
          } else {
            router.push(`/${searchType}/${value.trim()}`)
          }
        }}
        freeSolo
        multiple
        fullWidth
        value={['1']}
        options={[]}
        renderTags={() => <SearchChips disabled={disabled} />}
        filterSelectedOptions
        disabled={disabled}
        renderInput={(params) => (
          <TextFieldInput {...params} placeholder="Search..." />
        )}
      />
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        disableElevation
        sx={{
          borderRadius: 0,
        }}
        disabled={searchQueryValid.length === 0 || disabled}
      >
        <ManageSearch />
      </Button>
      <Dialog open={open} fullWidth maxWidth="xl" onClose={handleClose}>
        <DialogContent sx={{ height }}>
          <SearchGraph />
        </DialogContent>
        <DialogActions>
          {isQueryValid ? (
            <Button onClick={handleClose}>Done</Button>
          ) : (
            <>
              <Tooltip title="Invalid Query">
                <Warning color="warning" />
              </Tooltip>
              <Button disabled>Done</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </RootContainer>
  )
}

export default SearchInput
