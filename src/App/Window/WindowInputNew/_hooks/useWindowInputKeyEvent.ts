import { useCallback } from 'react';
import { useEvent } from 'react-use';
import { useRecoilState, useRecoilValue } from 'recoil';
import queryActiveNodeIdAtom from '../_atoms/searchQueryActiveNodeAtom';
import searchQueryOrderedAtom from '../_atoms/searchQueryOrderedAtom';
import queryTermAtom from '../_atoms/searchQueryTermAtom';

const useWindowInputKeyEvent = () => {
  const [activeNode, setActiveNode] = useRecoilState(queryActiveNodeIdAtom);
  const [searchTerm, setSearchTerm] = useRecoilState(queryTermAtom);
  const ordered = useRecoilValue(searchQueryOrderedAtom);

  const onKeyDown = useCallback(
    (evt: KeyboardEvent) => {
      if (activeNode && searchTerm === '') {
        const handleLeftRight = (direction: 'left' | 'right') => {
          const isRightKey = direction === 'right';
          const currIdx = ordered.findIndex(
            (entry) => entry.id === activeNode.nodeId
          );
          const nextIdx = isRightKey ? currIdx + 1 : currIdx - 1;

          setSearchTerm('');

          if (nextIdx > ordered.length - 1) {
            return setActiveNode({ nodeId: ordered[0].id });
          }

          if (nextIdx < 0) {
            return setActiveNode({ nodeId: ordered[ordered.length - 1].id });
          }

          return setActiveNode({ nodeId: ordered[nextIdx].id });
        };

        switch (evt.key) {
          case 'ArrowLeft': {
            handleLeftRight('left');
            break;
          }
          case 'ArrowRight': {
            handleLeftRight('right');
            break;
          }
          default:
        }
      }
    },
    [activeNode, ordered, searchTerm, setActiveNode, setSearchTerm]
  );

  useEvent('keyup', onKeyDown);
};

export default useWindowInputKeyEvent;
