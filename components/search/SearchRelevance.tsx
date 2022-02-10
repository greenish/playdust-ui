import { Slider, TextField, Typography } from '@mui/material'
import { useRecoilValue } from 'recoil'
import * as store from '../../store'

interface SearchRelevanceProps {
  id: string
}

const SearchRelevance = (props: SearchRelevanceProps) => {
  const data = useRecoilValue(store.searchQueryChild(props.id))
  const updateChild = store.useUpdateChild()

  return (
    <>
      <TextField
        fullWidth
        placeholder="is like"
        sx={{ mb: 2 }}
        value={data.value || ''}
        onChange={(evt) => updateChild(props.id, { value: evt.target.value })}
      />
      <Typography>relevance:</Typography>
      <Slider
        size="small"
        value={data.relevance || 50}
        onChange={(_evt, newValue) =>
          updateChild(props.id, { relevance: newValue as number })
        }
      />
    </>
  )
}

export default SearchRelevance
