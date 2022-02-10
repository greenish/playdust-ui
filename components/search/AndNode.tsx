import { Typography } from '@mui/material'
import { Handle, Position } from 'react-flow-renderer'

const AndNode = () => {
  return (
    <>
      <Typography fontSize={10}>AND</Typography>
      <Handle type="target" id="target" position={Position.Top} />
      <Handle type="source" id="source" position={Position.Top} />
    </>
  )
}

export default AndNode
