import React from 'react';
import WindowContextType from '../_types/WindowContextType';

const defaultWindowContext: WindowContextType = {
  setWindowImages: () => {},
};

const WindowContext =
  React.createContext<WindowContextType>(defaultWindowContext);

export default WindowContext;
