import { createAsyncThunk } from '@reduxjs/toolkit';
import { doLogin } from '../../../app/auth/api';
import { LoginFormInputs } from 'app/auth/forms';
import { sleep } from '../../../common/utils/common';
import { doLogout } from '@layout/api';
import { getUserProfile } from '../../../app/profile/api';
import { ScopeKey } from '@models/enum';

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

    // Xóa dữ liệu quyền và token trong localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem(ScopeKey.IS_AUTHENTICATED);
    localStorage.removeItem(ScopeKey.IS_SYSTEM_ADMIN);
    localStorage.removeItem(ScopeKey.IS_SYSTEM_HR);
    localStorage.removeItem(ScopeKey.IS_PREMIUM_SECTION);

    // Cập nhật trạng thái trên event "storage"
    window.dispatchEvent(new Event('storage'));

    return res;
  } catch (error) {
    return rejectWithValue('Logout failed.');
  }
});
