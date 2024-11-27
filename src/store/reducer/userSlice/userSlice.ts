import { createSlice } from '@reduxjs/toolkit';
import { loginThunk, getUserProfileThunk, logoutThunk } from './userThunk';
import { UserProfile } from '../../../app/auth/models';
import { ScopeKey, ScopeValue } from '@models/enum';
import { Redirect } from 'react-router-dom';

interface UserState {
  isFetchingLogin: boolean;
  isFetchingProfile: boolean;
  isLoggingOut: boolean;
  userLogin: string | null;
  userProfile: UserProfile | null;
}

const initialState: UserState = {
  isFetchingLogin: false,
  isFetchingProfile: false,
  isLoggingOut: false,
  userLogin: localStorage.getItem('access_token') || null,
  userProfile: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isFetchingLogin = true;
      })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.isFetchingLogin = false;
        localStorage.setItem('access_token', payload.data.access_token);
        localStorage.setItem(ScopeKey.IS_PREMIUM_SECTION, payload.data.user.isPremium);
        localStorage.setItem(ScopeKey.IS_AUTHENTICATED, ScopeValue.TRUE);
        if (payload.data.user.role.name !== 'NORMAL_USER') {
          localStorage.setItem(ScopeKey.IS_SYSTEM_ADMIN, ScopeValue.TRUE);
        } else {
          localStorage.setItem(ScopeKey.IS_SYSTEM_ADMIN, ScopeValue.FALSE);
        }
        state.userLogin = payload.data.access_token;
      })
      .addCase(loginThunk.rejected, (state) => {
        state.isFetchingLogin = false;
      })
      .addCase(getUserProfileThunk.pending, (state) => {
        state.isFetchingProfile = true;
      })
      .addCase(getUserProfileThunk.fulfilled, (state, { payload }) => {
        state.isFetchingProfile = false;
        state.userProfile = payload.data as UserProfile;
      })
      .addCase(getUserProfileThunk.rejected, (state) => {
        state.isFetchingProfile = false;
        state.userProfile = null;
      })
      .addCase(logoutThunk.pending, (state) => {
        state.isLoggingOut = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoggingOut = false;
        state.userLogin = null;
        state.userProfile = null;

        localStorage.removeItem('access_token');
        localStorage.removeItem(ScopeKey.IS_AUTHENTICATED);
        localStorage.removeItem(ScopeKey.IS_SYSTEM_ADMIN);
        localStorage.removeItem(ScopeKey.IS_PREMIUM_SECTION);
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.isLoggingOut = false;
      });
  },
});
