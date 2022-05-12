import React, { useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  OnLoadParams,
} from 'react-flow-renderer';
import { useInterval } from 'react-use';
import { useRecoilValue } from 'recoil';
import ActionNode from './ActionNode';
import HandleNode from './HandleNode';
import SearchNode from './SearchNode/SearchNode';
import searchEdgesAtom from './_atoms/searchEdgesAtom';
import searchNodesAtom from './_atoms/searchNodesAtom';

const nodeTypes = {
  actionNode: ActionNode,
  handleNode: HandleNode,
  searchNode: SearchNode,
};

function SearchGraph() {
  const [instanace, setInstance] = useState<OnLoadParams>();
  const nodes = useRecoilValue(searchNodesAtom);
  const edges = useRecoilValue(searchEdgesAtom);

  useInterval(() => {
    if (instanace) {
      instanace.fitView();
    }
  }, 100);

  return (
    <ReactFlow
      elements={[...nodes, ...edges]}
      onLoad={setInstance}
      nodeTypes={nodeTypes}
      snapToGrid={true}
      nodesDraggable={false}
      zoomOnScroll={false}
      nodesConnectable={false}
      paneMoveable={false}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={0.5} />
    </ReactFlow>
  );
}

export default SearchGraph;
