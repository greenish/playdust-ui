import { Edge } from 'react-flow-renderer'
import { selector } from 'recoil'
import { inputId, outputId } from './searchNodes'
import searchQuery, { QueryType } from './searchQuery'

interface CreateEdgeInput {
  sourceId: string
  sourceHandle?: 'top' | 'left' | 'right' | 'bottom'
  targetId: string
  targetHandle?: 'top' | 'left' | 'right' | 'bottom'
  label?: string
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
})

const getAndId = (parent: QueryType[]) => `${parent[0].id}-and`

const getInputEdges = (parent: QueryType[]) =>
  parent.map((child) =>
    createEdge({
      sourceId: inputId,
      targetId: child.id,
      targetHandle: 'left',
    })
  )

const getSingleOutputEdge = (parent: QueryType[]) =>
  createEdge({
    sourceId: getAndId(parent),
    targetId: outputId,
  })

const getOrEdges = (parent: QueryType[]) =>
  parent.slice(0, -1).map((child, idx) =>
    createEdge({
      sourceId: child.id,
      sourceHandle: 'bottom',
      targetId: parent[idx + 1].id,
      targetHandle: 'top',
      label: 'OR',
    })
  )

const getAndSourceEdges = (parent: QueryType[]) =>
  parent.map((child) =>
    createEdge({
      sourceId: child.id,
      sourceHandle: 'right',
      targetId: getAndId(parent),
    })
  )

const getAndTargetEdges = (parent: QueryType[], nextParent: QueryType[]) =>
  nextParent.map((child) =>
    createEdge({
      sourceId: getAndId(parent),
      targetId: child.id,
      targetHandle: 'left',
    })
  )

const searchEdges = selector<Edge[]>({
  key: 'searchEdges',
  get: ({ get }) => {
    const query = get(searchQuery)
    let edges: Edge[] = []

    query.forEach((parent, idx) => {
      if (idx === 0) {
        const inputEdges = getInputEdges(parent)
        edges.push(...inputEdges)
      }

      if (idx === query.length - 1) {
        const singleOuputEdge = getSingleOutputEdge(parent)
        edges.push(singleOuputEdge)
      }

      if (idx !== query.length - 1) {
        const andTargetEdges = getAndTargetEdges(parent, query[idx + 1])
        edges.push(...andTargetEdges)
      }

      const orEdges = getOrEdges(parent)
      const andSourceEdges = getAndSourceEdges(parent)

      edges.push(...orEdges, ...andSourceEdges)
    })

    return edges
  },
})

export default searchEdges
