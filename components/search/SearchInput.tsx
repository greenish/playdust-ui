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
import * as store from '../../store'
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
  const attributes = store.useNoWaitSearchAttributes()
  const exactAttributes = useRecoilValue(store.searchQueryExactAttributes)
  const addExactAttribute = store.useAddExactAttribute()
  const isQueryValid = useRecoilValue(store.isSearchQueryValid)
  const clearSearchQuery = store.useClearSearchQuery()
  const updateExactAttribute = store.useUpdateExactAttribute()
  const setSearchQueryValid = store.useSetSearchQueryValid()

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

  const flattenedAttributes = attributes.flatMap((entry) =>
    entry.options.map((option) => ({
      trait: entry.trait,
      option,
    }))
  )

  const value = [
    {
      trait: 'default',
      option: 'default',
    },
    ...flattenedAttributes.filter((entry) =>
      exactAttributes.find(
        (query) =>
          query.trait === entry.trait && query.value.includes(entry.option)
      )
    ),
  ]

  return (
    <RootContainer>
      <Autocomplete
        size={'small'}
        open={searchOpen}
        onOpen={() => setSearchOpen(true)}
        onClose={() => setSearchOpen(false)}
        onChange={(_evt, value) => {
          setSearchOpen(false)
          if (value.length === 0) {
            return clearSearchQuery()
          }

          const newValue = value[value.length - 1]
          const found = exactAttributes.find(
            (entry) => entry.trait === newValue.trait
          )

          if (found) {
            return updateExactAttribute(
              found.id,
              {
                value: [...found.value, newValue.option],
              },
              true
            )
          }

          addExactAttribute([newValue.option], newValue.trait, 'and')
        }}
        multiple
        fullWidth
        groupBy={(entry) => entry.trait}
        getOptionLabel={(option) => option.option.toString()}
        value={value}
        options={flattenedAttributes}
        renderTags={() => <SearchChips />}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField {...params} label="Filters" placeholder="Add Filters..." />
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
