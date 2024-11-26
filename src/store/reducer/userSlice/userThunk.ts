import { createAsyncThunk } from '@reduxjs/toolkit';
import { doLogin } from '../../../app/auth/api';
import { LoginFormInputs } from 'app/auth/forms';
import { sleep } from '../../../common/utils/common';
import { doLogout } from '@layout/api';
import { getUserProfile } from '../../../app/profile/api';

export const loginThunk = createAsyncThunk('user/login', async (payload: LoginFormInputs, { rejectWithValue }) => {
  try {
    await sleep();
    const res = await doLogin(payload);

    return res;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getUserProfileThunk = createAsyncThunk('user/getUserProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await getUserProfile();
    return res;
  } catch (error) {
    return rejectWithValue('Failed to fetch user profile');
  }
});

export const logoutThunk = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
  try {
    const res = await doLogout();
    return res;
  } catch (error) {
    return rejectWithValue('Logout failed.');
  }
});
