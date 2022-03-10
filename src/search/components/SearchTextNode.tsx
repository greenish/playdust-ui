import { TextField } from '@mui/material'
import { useDebounceCallback } from '@react-hook/debounce'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import * as store from '../store'

interface SearchTextNodeProps {
  id: string
}
const SearchTextNode = (props: SearchTextNodeProps) => {
  const data = useRecoilValue(store.searchQueryChild(props.id))
  const [value, setValue] = useState(data.value)
  const updateChild = store.useUpdateChild()
  const debounced = useDebounceCallback(updateChild, 1000)

  return (
    <TextField
      variant="outlined"
      value={value}
      sx={{ mt: 1 }}
      onChange={(evt) => {
        const nextValue = evt.target.value

        setValue(nextValue)
        debounced(data.id, { value: nextValue })
      }}
    />
  )
}

export default SearchTextNode
