import { Node } from 'react-flow-renderer';
import { selector } from 'recoil';
import type QueryNodeType from '../../../../../_types/QueryNodeType';
import searchStateUncommitted from '../../../_atoms/searchStateUncommitted';

const cardHeight = 175;
const yPaddingBottom = 75;
const yTotal = cardHeight + yPaddingBottom;

const cardWidth = 250;
const xOffset = 400;
const xGap = xOffset - cardWidth;
const andOffset = cardWidth + xGap / 2;

const createNode = (
  id: string,
  x: number,
  y: number,
  handles: object
): Node => ({
  id,
  type: 'searchNode',
  data: {
    width: cardWidth,
    height: cardHeight,
    handles,
  },
  position: { x, y },
});

const getX = (idx: number) => (idx + 1) * xOffset;

const getY = (
  idx: number,
  columnLength: number,
  largestColumn: number,
  isSearchNode = true
) => {
  const additionalOffset = (largestColumn - columnLength) / 2;
  const totalOffset = additionalOffset + idx;
  const searchNodeOffset = isSearchNode ? 0 : cardHeight / 2;

  return totalOffset * yTotal + searchNodeOffset;
};

const searchNodes = selector<(Node | Node<QueryNodeType>)[]>({
  key: 'searchNodes',
  get: ({ get }) => {
    const { query } = get(searchStateUncommitted);
    const largestColumn = Math.max(...query.map((parent) => parent.length));
    const queryNodes = query.flatMap((parent, idx) => {
      const mainNodes = parent.map((entry, ydx) => {
        const x = getX(idx);
        const y = getY(ydx, parent.length, largestColumn);
        const handles = {
          top: ydx !== 0,
          right: idx !== query.length - 1,
          bottom: ydx !== parent.length - 1,
          left: idx !== 0,
        };

        return createNode(entry.id, x, y, handles);
      });
      const isRange = parent.length === 1 && parent[0].field === 'range';
      const actionNode = {
        id: `${idx}-action`,
        type: 'actionNode',
        data: { idx, width: cardWidth, disableOr: isRange },
        position: {
          x: getX(idx),
          y: mainNodes[parent.length - 1].position.y + cardHeight + 20,
        },
      };

      return [...mainNodes, actionNode];
    });
    const andNodes = query.slice(0, -1).map((parent, idx) => ({
      id: `${parent[0].id}-and`,
      type: 'handleNode',
      data: {
        label: 'AND',
      },
      position: {
        x: getX(idx) + andOffset,
        y: getY(0, 1, largestColumn, false) + 3,
      },
    }));

    return [...queryNodes, ...andNodes];
  },
});

export default searchNodes;
