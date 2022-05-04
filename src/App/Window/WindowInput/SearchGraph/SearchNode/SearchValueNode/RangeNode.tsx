import styled from '@emotion/styled'
import { useRecoilValue } from 'recoil'
import type RangeQueryNodeType from '../../../../../../_types/RangeQueryNodeType'
import searchQueryChild from '../../../../_atoms/searchQueryChild'
import useUpdateRangeQueryNode from '../../../../_hooks/useUpdateRangeQueryNode'
import RangeInput from '../../../../_sharedComponents/RangeInput'

const RootContainer = styled.div`
  margin-top: 16px;
`

interface RangeNodeProps {
  id: string
}

const RangeNode = (props: RangeNodeProps) => {
  const data = useRecoilValue(searchQueryChild(props.id)) as RangeQueryNodeType
  const updateRangeQueryNode = useUpdateRangeQueryNode('memory')

  return (
    <RootContainer>
      <RangeInput
        value={data.value}
        min={data.min}
        max={data.max}
        onApply={(update) => updateRangeQueryNode({ id: data.id, update })}
      />
    </RootContainer>
  )
}

export default RangeNode
