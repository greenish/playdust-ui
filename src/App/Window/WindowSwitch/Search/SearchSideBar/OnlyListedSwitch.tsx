import { FormControlLabel, Switch } from '@mui/material'
import { useRecoilValue } from 'recoil'
import searchStateAtom from '../../../_atoms/searchState'
import useSetOnlyListed from '../../../_hooks/useSetOnlyListed'

const OnlyListedSwitch = () => {
  const { onlyListed } = useRecoilValue(searchStateAtom)
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
