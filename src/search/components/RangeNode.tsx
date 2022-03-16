import styled from '@emotion/styled'
import { useRecoilValue } from 'recoil'
import * as store from '../store'
import { RangeQuery } from '../types/ComposedQueryType'
import RangeInput from './RangeInput'

const RootContainer = styled.div`
  margin-top: 16px;
`

interface RangeNodeProps {
  id: string
}

const RangeNode = (props: RangeNodeProps) => {
  const data = useRecoilValue(store.searchQueryChild(props.id)) as RangeQuery
  const updateRange = store.useUpdateRange()

  return (
    <RootContainer>
      <RangeInput
        value={data.value}
        min={data.min}
        max={data.max}
        onApply={updateRange(data.id)}
      />
    </RootContainer>
  )
}

export default RangeNode
