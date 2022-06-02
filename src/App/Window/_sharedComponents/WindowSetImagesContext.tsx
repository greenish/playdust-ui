import React from 'react';
import WindowSetImagesType from '../_types/WindowSetImagesType';

const defaultWindowSetImages: WindowSetImagesType = () => {};

const WindowSetImagesContext = React.createContext<WindowSetImagesType>(
  defaultWindowSetImages
);

export default WindowSetImagesContext;
