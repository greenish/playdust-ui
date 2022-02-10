import React, { useState } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  OnLoadParams,
} from 'react-flow-renderer'
import { useInterval } from 'react-use'
import { useRecoilValue } from 'recoil'
import * as store from '../../store'
import ActionNode from './ActionNode'
import AndNode from './AndNode'
import SearchNode from './SearchNode'

const nodeTypes = {
  actionNode: ActionNode,
  andNode: AndNode,
  searchNode: SearchNode,
}

const SearchGraph = () => {
  const [instanace, setInstance] = useState<OnLoadParams>()
  const nodes = useRecoilValue(store.searchNodes)
  const edges = useRecoilValue(store.searchEdges)

  useInterval(() => {
    if (instanace) {
      instanace.fitView()
    }
  }, 100)

  return (
    <ReactFlow
      elements={[...nodes, ...edges]}
      onLoad={setInstance}
      nodeTypes={nodeTypes}
      snapToGrid={true}
      defaultZoom={1.5}
      nodesDraggable={false}
      zoomOnScroll={false}
      nodesConnectable={false}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={0.5} />
    </ReactFlow>
  )
}

export default SearchGraph
