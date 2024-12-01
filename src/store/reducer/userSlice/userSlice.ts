import { createSlice } from '@reduxjs/toolkit';
import { loginThunk, getUserProfileThunk, logoutThunk } from './userThunk';
import { ScopeKey, ScopeValue } from '@models/enum';
import { UserProfile } from 'app/auth/models';

interface UserState {
  isFetchingLogin: boolean;
  isFetchingProfile: boolean;
  isLoggingOut: boolean;
  userLogin: string | null;
  userProfile: any | null;
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
        localStorage.setItem(ScopeKey.IS_AUTHENTICATED, ScopeValue.TRUE);

        if (payload.data.user.role.name === 'SUPER_ADMIN') {
          localStorage.setItem(ScopeKey.IS_SYSTEM_ADMIN, ScopeValue.TRUE);
          localStorage.setItem(ScopeKey.IS_SYSTEM_HR, ScopeValue.FALSE); 
        } else if (payload.data.user.role.name === 'HR') {
          localStorage.setItem(ScopeKey.IS_SYSTEM_HR, ScopeValue.TRUE);
          localStorage.setItem(ScopeKey.IS_SYSTEM_ADMIN, ScopeValue.FALSE);
        } else {
          localStorage.setItem(ScopeKey.IS_SYSTEM_ADMIN, ScopeValue.FALSE);
          localStorage.setItem(ScopeKey.IS_SYSTEM_HR, ScopeValue.FALSE);
        }

        state.userLogin = payload.data.access_token;

        window.dispatchEvent(new Event('storage'));
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
      .addCase(loginThunk.rejected, (state) => {
        state.isFetchingLogin = false;
      })
      .addCase(logoutThunk.pending, (state) => {
        state.isLoggingOut = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoggingOut = false;
        state.userLogin = null;
        state.userProfile = null;
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.isLoggingOut = false;
      });
  },
});
