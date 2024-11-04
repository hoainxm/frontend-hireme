/** @format */

import { backgroundDataSlice, mainSlice, sectionDotSlice, sideBarSlice, toastsSlice } from '../common/ui/layout/slice';

import { combineReducers } from '@reduxjs/toolkit';
import { popupSlice } from '../common/ui/layout/popup-layout/slice';
import { sysSlice } from '../routers/slice';
import { userSlice } from './reducer/userSlice/userSlice';

export const rootReducer = combineReducers({
  sys: sysSlice.reducer,
  main: mainSlice.reducer,
  sideBar: sideBarSlice.reducer,
  popup: popupSlice.reducer,
  welcomeInfo: backgroundDataSlice.reducer,
  sectionDot: sectionDotSlice.reducer,
  toasts: toastsSlice.reducer,
  user: userSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
