import React from 'react';
import { useRecoilValue } from 'recoil';
import windowStateAtom from '../../_atoms/windowStateAtom';
import Address from './Address/Address';
import Home from './Home/Home';
import Search from './Search/Search';

function WindowSwitch() {
  const windowState = useRecoilValue(windowStateAtom);

  switch (windowState?.type) {
    case 'home':
      return <Home />;
    case 'search':
      return <Search />;
    case 'address':
      return <Address />;
    case 'block':
      return null;
    case 'tx':
      return null;
    case 'epoch':
      return null;
    default:
      return null;
  }
}

export default WindowSwitch;
