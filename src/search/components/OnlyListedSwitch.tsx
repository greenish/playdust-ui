import { FormControlLabel, Switch } from '@mui/material'
import { useRecoilValue } from 'recoil'
import { useSetOnlyListed } from '../hooks/useSearchChange'
import * as store from '../store'

const OnlyListedSwitch = () => {
  const { onlyListed } = useRecoilValue(store.searchState)
  const setOnlyListed = useSetOnlyListed()

  return (
    <FormControlLabel
      control={
        <Switch
          checked={Boolean(onlyListed)}
          onChange={() => setOnlyListed(!onlyListed)}
        />
      }
      label="Only Listed Items"
    />
  )
}

export default OnlyListedSwitch
