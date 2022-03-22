import { FormControlLabel, Switch } from '@mui/material'
import { useRecoilState } from 'recoil'
import * as store from '../store'

const OnlyListedSwitch = () => {
  const [onlyListed, setOnlyListed] = useRecoilState(store.searchOnlyListed)

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
