import React from 'react';
import WindowContextType from '../_types/WindowContextType';

const defaultWindowSetImages: WindowContextType = () => {};

const WindowSetImagesContext = React.createContext<WindowContextType>(
  defaultWindowSetImages
);

export default WindowSetImagesContext;
