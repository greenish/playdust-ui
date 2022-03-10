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
import { useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import * as store from '../store'
import SearchChips from './SearchChips'
import SearchGraph from './SearchGraph'

const RootContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const SearchInput = () => {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const isQueryValid = useRecoilValue(store.isSearchQueryValid)
  const setSearchQueryValid = store.useSetSearchQueryValid()
  const addText = store.useAddText()
  const clearSearchQuery = store.useClearSearchQuery()

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

          if (value && value.length) {
            addText(value, 'and')
          }
        }}
        freeSolo
        multiple
        fullWidth
        value={['1']}
        options={[]}
        renderTags={() => <SearchChips />}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField {...params} label="Search" placeholder="Search..." />
        )}
      />
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          marginLeft: '-3px',
          zIndex: 10,
        }}
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
