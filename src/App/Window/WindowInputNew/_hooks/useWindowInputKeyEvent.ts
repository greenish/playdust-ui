import { useCallback } from 'react';
import { useEvent } from 'react-use';
import { useRecoilState, useRecoilValue } from 'recoil';
import queryActiveNodeIdAtom from '../_atoms/searchQueryActiveNodeIdAtom';
import searchQueryOrderedAtom from '../_atoms/searchQueryOrderedAtom';
import queryTermAtom from '../_atoms/searchQueryTermAtom';

const useWindowInputKeyEvent = () => {
  const [activeNodeId, setActiveNodeId] = useRecoilState(queryActiveNodeIdAtom);
  const [searchTerm, setSearchTerm] = useRecoilState(queryTermAtom);
  const ordered = useRecoilValue(searchQueryOrderedAtom);

  const onKeyDown = useCallback(
    (evt: KeyboardEvent) => {
      if (activeNodeId && searchTerm === '') {
        const handleLeftRight = (direction: 'left' | 'right') => {
          const isRightKey = direction === 'right';
          const currIdx = ordered.findIndex(
            (entry) => entry.id === activeNodeId
          );
          const nextIdx = isRightKey ? currIdx + 1 : currIdx - 1;

          setSearchTerm('');

          if (nextIdx > ordered.length - 1) {
            return setActiveNodeId(ordered[0].id);
          }

          if (nextIdx < 0) {
            return setActiveNodeId(ordered[ordered.length - 1].id);
          }

          return setActiveNodeId(ordered[nextIdx].id);
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
    [activeNodeId, ordered, searchTerm, setActiveNodeId, setSearchTerm]
  );

  useEvent('keyup', onKeyDown);
};

export default useWindowInputKeyEvent;
