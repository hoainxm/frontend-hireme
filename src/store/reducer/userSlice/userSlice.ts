import { createSlice } from '@reduxjs/toolkit';
import { loginThunk, getUserProfileThunk, logoutThunk } from './userThunk';
import { UserProfile } from '../../../app/auth/models';
import { ScopeKey } from '@models/enum';

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
        localStorage.removeItem(ScopeKey.IS_PREMIUM_SECTION);
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.isLoggingOut = false;
      });
  },
});
