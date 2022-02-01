import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useDebounceCallback } from '@react-hook/debounce'
import axios from 'axios'
import { useState } from 'react'

const fetchSearchResults = async (term: string) => {
  const { data } = await axios.get('/api/collection-search', {
    params: {
      term,
    },
  })
}

const AppBarSearch = () => {
  const search = useDebounceCallback(fetchSearchResults, 1000)
  const [open, setOpen] = useState(false)
  const loading = false

  return (
    <Autocomplete
      disabled
      sx={{ width: 300 }}
      open={false}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      options={[]}
      loading={loading}
      renderInput={(params) => (
        <TextField
          variant="filled"
          onChange={(evt) => search(evt.target.value)}
          {...params}
          label="Search Collections..."
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}

export default AppBarSearch
