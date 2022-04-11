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
import { useDebounceCallback } from '@react-hook/debounce'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'
import SearchGraph from '../../search/components/SearchGraph'
import * as searchStore from '../../search/store'
import getWindowType from '../helpers/getWindowType'
import * as store from '../store'
import WindowProps from '../types/WindowProps'
import SearchChips from './SearchChips'
import SuggestionResult from './SuggestionResult'

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
  const addAttribute = searchStore.useAddAttribute()
  const addCollection = searchStore.useAddCollection()
  const addText = searchStore.useAddText()
  const searchQueryValid = useRecoilValue(searchStore.searchQueryValid)
  const loadable = useRecoilValueLoadable(searchStore.searchResults)
  const isSearchable = type === 'search' || type === 'home'

  const [suggestionTerm, setSuggestionTerm] = useRecoilState(
    store.searchSuggestionTerm
  )
  const debouncedSearchSuggestions = useDebounceCallback(setSuggestionTerm, 500)
  const { suggestions, loading: suggestionsLoading } = useRecoilValue(
    store.searchSuggestions
  )

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

          if (!value) {
            return
          }

          // value is string if enter key is pressed
          if (typeof value === 'string') {
            const type = getWindowType(value)

            if (type !== 'search') {
              return addTab({
                type,
                state: value,
              })
            }

            return addText(value, 'and')
          }

          switch (value.group) {
            case 'Collections':
              return addCollection(value.meta!, 'and')
            case 'Search':
              return addText(value.type, 'and')
            case 'Explorer':
              return addTab({
                type: value.type,
                state: suggestionTerm,
              })
            case 'Attribute Value':
              return addAttribute([value.meta!], '', 'and')
            case 'Attribute Category':
              return addAttribute([], value.meta!, 'and')
            default:
              const n: never = value.group
              return n
          }
        }}
        freeSolo
        multiple
        fullWidth
        value={['1']}
        options={state === '' ? suggestions : []}
        groupBy={(option) => option.group}
        filterOptions={(x) => x}
        renderOption={(props, option) => (
          <SuggestionResult
            key={option.key}
            parentProps={props}
            label={option.label}
            highlight={option.highlight}
            term={suggestionTerm}
            showLoader={
              suggestions[suggestions.length - 1].key === option.key &&
              suggestionsLoading
            }
          />
        )}
        renderTags={() =>
          isSearchable ? (
            <SearchChips disabled={disabled} removeTab={removeTab} />
          ) : (
            <Chip
              size="small"
              label={`${type}: ${state}`}
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
            onChange={(evt) => debouncedSearchSuggestions(evt.target.value)}
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
