import { Node, Position } from 'react-flow-renderer'
import { selector } from 'recoil'
import searchQuery, { QueryType } from './searchQuery'

const cardHeight = 175
const yPaddingBottom = 75
const yTotal = cardHeight + yPaddingBottom

const cardWidth = 250
const xOffset = 400
const xGap = xOffset - cardWidth
const andOffset = cardWidth + xGap / 2

export const inputId = 'input'
export const outputId = 'output'

const createNode = (id: string, x: number, y: number): Node => ({
  id,
  type: 'searchNode',
  data: {
    width: cardWidth,
    height: cardHeight,
  },
  position: { x, y },
})

const getX = (idx: number) => {
  return (idx + 1) * xOffset
}

const getY = (
  idx: number,
  columnLength: number,
  largestColumn: number,
  isSearchNode = true
) => {
  const additionalOffset = (largestColumn - columnLength) / 2
  const totalOffset = additionalOffset + idx
  const searchNodeOffset = isSearchNode ? 0 : cardHeight / 2

  return totalOffset * yTotal + searchNodeOffset
}

const getIONodes = (queryLength: number, largestColumn: number): Node[] => [
  {
    id: inputId,
    type: 'input',
    data: { label: 'Input' },
    style: { borderColor: 'black' },
    position: { x: 100, y: getY(0, 1, largestColumn, false) - 19 },
    sourcePosition: Position.Right,
  },
  {
    id: outputId,
    type: 'output',
    data: { label: 'Output' },
    style: { borderColor: 'black' },
    position: {
      x: getX(queryLength),
      y: getY(0, 1, largestColumn, false) - 19,
    },
    targetPosition: Position.Left,
  },
]

const searchNodes = selector<(Node | Node<QueryType>)[]>({
  key: 'searchNodes',
  get: ({ get }) => {
    const query = get(searchQuery)
    const largestColumn = Math.max(...query.map((parent) => parent.length))
    const queryNodes = query.flatMap((parent, idx) => {
      const mainNodes = parent.map((entry, ydx) =>
        createNode(entry.id, getX(idx), getY(ydx, parent.length, largestColumn))
      )
      const actionNode = {
        id: `${idx}-action`,
        type: 'actionNode',
        data: { idx, width: cardWidth },
        position: {
          x: getX(idx),
          y: mainNodes[parent.length - 1].position.y + cardHeight + 20,
        },
      }

      return [...mainNodes, actionNode]
    })
    const andNodes = query.map((parent, idx) => ({
      id: `${parent[0].id}-and`,
      type: 'andNode',
      position: {
        x: getX(idx) + andOffset,
        y: getY(0, 1, largestColumn, false) + 3,
      },
    }))

    return [
      ...getIONodes(query.length, largestColumn),
      ...queryNodes,
      ...andNodes,
    ]
  },
})

export default searchNodes
