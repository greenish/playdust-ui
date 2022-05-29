import React, { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-use';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import windowStateAtom from '../_atoms/windowStateAtom';
import windowStateAvailableAtom from './_atoms/windowStateAvailableAtom';
import decodeWindowHash from '../../_helpers/decodeWindowHash';
import WindowContext from '../_sharedComponents/WindowContext';
import WindowContextType from '../_types/WindowContextType';

function WindowStateListener() {
  const location = useLocation();
  const setCurrentState = useSetRecoilState(windowStateAtom);

  useEffect(() => {
    setCurrentState(decodeWindowHash(location));
  }, [location, setCurrentState]);

  return null;
}

type WindowStateProviderProps = {
  context: WindowContextType;
  children: ReactNode;
};

function WindowStateProvider({ context, children }: WindowStateProviderProps) {
  const windowStateAvailable = useRecoilValue(windowStateAvailableAtom);

  return (
    <>
      <WindowStateListener />
      <WindowContext.Provider value={context}>
        {windowStateAvailable && children}
      </WindowContext.Provider>
    </>
  );
}

export default WindowStateProvider;
