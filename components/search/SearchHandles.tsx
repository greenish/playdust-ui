import { Handle, Position } from 'react-flow-renderer'

const SearchHandles = () => {
  return (
    <>
      <Handle type="target" id="left" position={Position.Left} />
      <Handle type="target" id="top" position={Position.Top} />
      <Handle type="source" id="bottom" position={Position.Bottom} />
      <Handle type="source" id="right" position={Position.Right} />
    </>
  )
}

export default SearchHandles
