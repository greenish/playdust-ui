import { Edge } from 'react-flow-renderer';
import { selector } from 'recoil';
import type QueryNodeType from '../../../../../_types/QueryNodeType';
import searchStateUncommitted from '../../../_atoms/searchStateUncommitted';

interface CreateEdgeInput {
  sourceId: string;
  sourceHandle?: 'top' | 'left' | 'right' | 'bottom';
  targetId: string;
  targetHandle?: 'top' | 'left' | 'right' | 'bottom' | 'target';
  label?: string;
}

const createEdge = ({
  sourceId,
  sourceHandle,
  targetId,
  targetHandle,
  label = '',
}: CreateEdgeInput) => ({
  id: `edge-${sourceId}-${targetId}`,
  source: sourceId,
  target: targetId,
  sourceHandle,
  targetHandle,
  animated: true,
  label,
});

const getAndId = (parent: QueryNodeType[]) => `${parent[0].id}-and`;

const getOrEdges = (parent: QueryNodeType[]) =>
  parent.slice(0, -1).map((child, idx) =>
    createEdge({
      sourceId: child.id,
      sourceHandle: 'bottom',
      targetId: parent[idx + 1].id,
      targetHandle: 'top',
      label: 'OR',
    })
  );

const getAndSourceEdges = (parent: QueryNodeType[]) =>
  parent.map((child) =>
    createEdge({
      sourceId: child.id,
      sourceHandle: 'right',
      targetId: getAndId(parent),
      targetHandle: 'target',
    })
  );

const getAndTargetEdges = (
  parent: QueryNodeType[],
  nextParent: QueryNodeType[]
) =>
  nextParent.map((child) =>
    createEdge({
      sourceId: getAndId(parent),
      targetId: child.id,
      targetHandle: 'left',
    })
  );

const searchEdges = selector<Edge[]>({
  key: 'searchEdges',
  get: ({ get }) => {
    const { query } = get(searchStateUncommitted);
    const edges: Edge[] = [];

    query.forEach((parent, idx) => {
      if (idx !== query.length - 1) {
        const andTargetEdges = getAndTargetEdges(parent, query[idx + 1]);
        const andSourceEdges = getAndSourceEdges(parent);
        edges.push(...andTargetEdges, ...andSourceEdges);
      }

      const orEdges = getOrEdges(parent);
      edges.push(...orEdges);
    });

    return edges;
  },
});

export default searchEdges;
