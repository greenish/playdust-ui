import styled from '@emotion/styled'
import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { useRecoilState } from 'recoil'
import collectionSort, { CollectionSortType } from '../../store/collectionSort'

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px;
`

const SortFields = () => {
  const [sort, setSort] = useRecoilState(collectionSort)

  const changeSort = (newVal: any, s: CollectionSortType) => {
    const newS = { ...s }
    const newSorts = [...sort]
    newS.selectedValue = newVal
    newSorts.splice(
      newSorts.findIndex((el) => el.name === newS.name),
      1,
      newS
    )
    setSort(newSorts)
  }

  return (
    <RootContainer>
      <Typography sx={{ marginBottom: 2 }}>Sort</Typography>
      {sort.map((s) => (
        <FormControl key={s.name}>
          <InputLabel id={`select-${s.name}-label`}>{s.name}</InputLabel>
          <Select
            labelId={`select-${s.name}-label`}
            value={s.selectedValue}
            label={s.name}
            onChange={(e) => changeSort(e.target.value, s)}
          >
            {s.values.map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
      <Divider sx={{ marginTop: 2 }} />
    </RootContainer>
  )
}

export default SortFields
