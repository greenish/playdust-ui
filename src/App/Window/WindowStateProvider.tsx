import { useEffect } from 'react';
import { useLocation } from 'react-use';
import { useSetRecoilState } from 'recoil';
import decodeWindowHash from '../_helpers/decodeWindowHash';
import currentStateAtom from './_atoms/currentStateAtom';

function WindowStateProvider() {
  const location = useLocation();
  const setCurrentState = useSetRecoilState(currentStateAtom);

  useEffect(() => {
    const { windowState } = decodeWindowHash(location);
    setCurrentState(windowState);
  }, [location, setCurrentState]);
  return null;
}

export default WindowStateProvider;
