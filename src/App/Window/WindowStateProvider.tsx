import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { WindowStateType } from '../_types/WindowStateType';
import windowStateAtom from './_atoms/windowStateAtom';
import WindowSetImagesType from './_types/WindowSetImagesType';
import setWindowImagesAtom from './_atoms/setWindowImagesAtom';
import useProfileState from './_hooks/useProfileState';
import ProfileStorageType from './_types/ProfileStorageType';

type WindowStateProviderProps = {
  setWindowImages: WindowSetImagesType;
  windowState: WindowStateType;
  profileState: ProfileStorageType;
};

function WindowStateProvider({
  setWindowImages,
  profileState,
  windowState,
}: WindowStateProviderProps) {
  const setCurrentState = useSetRecoilState(windowStateAtom);
  const setSetWindowImages = useSetRecoilState(setWindowImagesAtom);
  const [, , syncProfile] = useProfileState();

  useEffect(() => {
    if (windowState) {
      setCurrentState(windowState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowState]);

  useEffect(() => {
    syncProfile(profileState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileState]);

  useEffect(() => {
    setSetWindowImages(() => setWindowImages);
  }, [setWindowImages, setSetWindowImages]);

  return null;
}

export default WindowStateProvider;
