import styled from '@emotion/styled'
import { ManageSearch, Warning } from '@mui/icons-material'
import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Tooltip,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import SearchGraph from '../../search/components/SearchGraph'
import * as searchStore from '../../search/store'
import getWindowType from '../helpers/getWindowType'
import WindowProps from '../types/WindowProps'
import SearchChips from './SearchChips'

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

const SearchInput = ({ addTab, state, type, removeTab }: WindowProps) => {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const isQueryValid = useRecoilValue(searchStore.isSearchQueryValid)
  const setSearchQueryValid = searchStore.useSetSearchQueryValid()
  const addText = searchStore.useAddText()
  const searchQueryValid = useRecoilValue(searchStore.searchQueryValid)
  const loadable = useRecoilValueLoadable(searchStore.searchResults)
  const isSearchable = type === 'search' || type === 'home'

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
  const disabled = loadable.state === 'loading' || !isSearchable

  return (
    <RootContainer>
      <Autocomplete
        size={'small'}
        open={searchOpen}
        onOpen={() => setSearchOpen(true)}
        onClose={() => setSearchOpen(false)}
        onChange={(_evt, [_placeholder, value], reason) => {
          if (reason === 'clear') {
            return removeTab()
          }

          if (!value || !value.length) {
            return
          }

          const type = getWindowType(value)

          if (type !== 'search') {
            return addTab({
              type,
              value,
            })
          }

          return addText(value, 'and')
        }}
        freeSolo
        multiple
        fullWidth
        value={['1']}
        options={[]}
        renderTags={() =>
          isSearchable ? (
            <SearchChips disabled={disabled} removeTab={removeTab} />
          ) : (
            <Chip
              size="small"
              label={state}
              variant="outlined"
              onDelete={() => removeTab()}
            />
          )
        }
        filterSelectedOptions
        disabled={disabled}
        renderInput={(params) => (
          <TextFieldInput
            {...params}
            placeholder={isSearchable ? 'Search...' : ''}
          />
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
