import styled from '@emotion/styled'
import { useRecoilValue } from 'recoil'
import { useUpdateRangeNode } from '../../hooks/useSearchChange'
import * as store from '../../store'
import { RangeQuery } from '../../types/ComposedQueryType'
import RangeInput from '../RangeInput'

const RootContainer = styled.div`
  margin-top: 16px;
`

interface RangeNodeProps {
  id: string
}

const RangeNode = (props: RangeNodeProps) => {
  const data = useRecoilValue(store.searchQueryChild(props.id)) as RangeQuery
  const updateRangeNode = useUpdateRangeNode('memory')

  return (
    <RootContainer>
      <RangeInput
        value={data.value}
        min={data.min}
        max={data.max}
        onApply={(update) => updateRangeNode({ id: data.id, update })}
      />
    </RootContainer>
  )
}

export default RangeNode
