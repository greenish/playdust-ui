import { TextField } from '@mui/material'
import { useRecoilValue } from 'recoil'
import { useUpdateTextNode } from '../../hooks/useSearchChange'
import * as store from '../../store'

interface SearchTextNodeProps {
  id: string
}
const SearchTextNode = (props: SearchTextNodeProps) => {
  const data = useRecoilValue(store.searchQueryChild(props.id))
  const updateTextNode = useUpdateTextNode('memory')

  return (
    <TextField
      variant="outlined"
      sx={{ mt: 1 }}
      defaultValue={data.value}
      onChange={(evt) =>
        updateTextNode({ id: props.id, text: evt.target.value })
      }
    />
  )
}

export default SearchTextNode
