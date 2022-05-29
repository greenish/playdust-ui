import React from 'react';
import WindowProps from '../_types/WindowPropsType';
import Address from './Address/Address';
import Home from './Home/Home';
import Search from './Search/Search';

function WindowSwitch(props: WindowProps) {
  switch (props.type) {
    case 'home':
      return <Home />;
    case 'search':
      return <Search {...props} />;
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
