import React from 'react';
import { WindowStateType } from '../../_types/WindowStateType';

const WindowStateContext = React.createContext<WindowStateType | null>(null);

export default WindowStateContext;
