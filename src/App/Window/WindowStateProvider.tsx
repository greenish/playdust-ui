import { useEffect } from 'react';
import { useLocation } from 'react-use';
import { useSetRecoilState } from 'recoil';
import windowStateAtom from '../_atoms/windowStateAtom';
import decodeWindowHash from '../_helpers/decodeWindowHash';

function WindowStateProvider() {
  const location = useLocation();
  const setCurrentState = useSetRecoilState(windowStateAtom);

  useEffect(() => {
    setCurrentState(decodeWindowHash(location));
  }, [location, setCurrentState]);
  return null;
}

export default WindowStateProvider;
