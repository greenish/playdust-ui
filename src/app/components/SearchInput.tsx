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
import { createFilterOptions } from '@mui/material/Autocomplete'
import { useDebounceCallback } from '@react-hook/debounce'
import { useMemo, useState } from 'react'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'
import SearchGraph from '../../search/components/SearchGraph'
import {
  useAddAttributeNode,
  useAddTextNode,
  usePrependCollectionNode,
} from '../../search/hooks/useSearchChange'
import * as searchStore from '../../search/store'
import getWindowType from '../helpers/getWindowType'
import { usePushWindowHash } from '../helpers/getWindowUrl'
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

const clientFilter = createFilterOptions({
  stringify: (option: any) => option.label,
})

const SearchInput = ({ state, type, removeTab }: WindowProps) => {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const isQueryValid = useRecoilValue(searchStore.isSearchQueryValid)
  const searchQueryValid = useRecoilValue(searchStore.searchQueryValid)
  const searchSerializedTemp = useRecoilValue(
    searchStore.searchSerializedSelected
  )
  const loadable = useRecoilValueLoadable(searchStore.searchResults)
  const isSearchable = type === 'search' || type === 'home'
  const addTextNode = useAddTextNode()
  const addAttributeNode = useAddAttributeNode()
  const prependCollectionNode = usePrependCollectionNode()
  const pushWindowHash = usePushWindowHash()

  const [suggestionTerm, setSuggestionTerm] = useRecoilState(
    store.searchSuggestionTerm
  )
  const debouncedSearchSuggestions = useDebounceCallback(setSuggestionTerm, 500)
  const { suggestions, loading: suggestionsLoading } = useRecoilValue(
    store.searchSuggestions(state)
  )
  const filterOnServer = state === ''

  const height = useMemo(() => {
    return window.innerHeight * 0.8
  }, [window.innerHeight])

  const handleClose = () => {
    if (!isQueryValid) {
      return
    }

    pushWindowHash({
      type: 'search',
      state: searchSerializedTemp,
    })

    setOpen(false)
  }
  const disabled = loadable.state === 'loading' || !isSearchable

  return (
    <RootContainer>
      <Autocomplete
        size={'small'}
        open={searchOpen}
        filterOptions={filterOnServer ? (x) => x : clientFilter}
        onOpen={() => setSearchOpen(true)}
        onClose={() => setSearchOpen(false)}
        onChange={(_evt, [_placeholder, value], reason) => {
          if (reason === 'clear') {
            return removeTab()
          }

          if (!value) {
            return
          }

          setSuggestionTerm('')

          // value is string if enter key is pressed
          if (typeof value === 'string') {
            const type = getWindowType(value)

            if (type !== 'search') {
              return pushWindowHash({
                type,
                state: value,
              })
            }

            return addTextNode(value)
          }

          switch (value.group) {
            case 'Collections':
              return prependCollectionNode(value.meta!)
            case 'Search':
              return addTextNode(suggestionTerm)
            case 'Explorer':
              return pushWindowHash({
                type: value.type,
                state: suggestionTerm,
              })
            case 'Attribute':
              if (!value.attributeMeta) {
                return
              }

              return addAttributeNode({
                value: [value.attributeMeta.option],
                trait: value.attributeMeta.trait,
                operation: 'and',
              })
            case 'Attribute Value':
              return addAttributeNode({
                value: [value.meta!],
                trait: '',
                operation: 'and',
              })
            case 'Attribute Trait':
              return addAttributeNode({
                value: [],
                trait: value.meta!,
                operation: 'and',
              })
            default:
              const n: never = value.group
              return n
          }
        }}
        freeSolo
        multiple
        fullWidth
        value={['1']}
        options={suggestions}
        groupBy={(option) => option.group}
        renderOption={(props, option) => (
          <SuggestionResult
            key={option.key}
            parentProps={props}
            label={option.label}
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
            onChange={(evt) => {
              filterOnServer
                ? debouncedSearchSuggestions(evt.target.value)
                : setSuggestionTerm(evt.target.value)
            }}
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
