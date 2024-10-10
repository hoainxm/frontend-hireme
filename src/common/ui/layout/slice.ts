/** @format */

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ScopeKey, ScopeValue, SectionID } from '../../../models/enum';
import { doGetWelcomeInfo, getProfile } from './api';

import { AuthWelcomeInfo } from '../../../app/auth/forms';
import { UserProfile } from '../../../app/auth/models';
import { getTenantByIdAPI } from '../../../app/auth/api';
import i18n from '../../i18n';
import { ToastItem } from './model';

interface MainSliceInitial {
  userInfo: UserProfile | null;
}

interface SideBarSliceInitial {
  isExpand: boolean;
}

const initialState: MainSliceInitial = {
  // userInfo: {
  //   id: 1,
  //   username: '6b6b50f9-b2a3-4b40-8f79-2880aee0245c_namm0704@gmail.com',
  //   tenant: '6b6b50f9-b2a3-4b40-8f79-2880aee0245c',
  //   social_token: 's7uj66',
  //   user_id: 'namm0704@gmail.com',
  //   first_name: 'Nam',
  //   last_name: 'Phan Nguyen Hoai',
  //   email: 'namm0704@gmail.com',
  //   full_name: 'Phan Nguyen Hoai Nam',
  //   gender: 'O',
  //   avatar: null,
  //   additional_info: null,
  //   is_superuser: false,
  //   is_reset_password: 'false',
  //   created_on: '03/05/2024',
  //   tenant_logo: '',
  //   last_login: '',
  //   default_pool: '',
  //   is_blacklist: false,
  //   user_roles: [
  //     {
  //       role: 'SUPER ADMIN',
  //       department: '',
  //     },
  //   ],
  // },
};

const sideBarInitial: SideBarSliceInitial = {
  isExpand: false,
};

interface LangInterface {
  curLang: string;
}

const langInitial: LangInterface = {
  curLang: 'VI',
};

interface BackgroundDataInterface {
  backgroundData: AuthWelcomeInfo | null;
}

interface SectionDotInterface {
  sectionId?: SectionID;
}

interface ToastsInterface {
  toastIdCounter: number;
  toasts: Array<ToastItem>;
}

const backGroundDataInitial: BackgroundDataInterface = {
  backgroundData: {
    address: 'Đại học Sư phạm kỹ thuật TPHCM, #1 Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh',
    background: '#1eb2ff',
    email: 'contact@hireme.vn',
    primary_logo: '',
    phone_detail: '(032) 982 3154',
    primary_name: i18n.t('title.name'),
    secondary_logo: '',
  },
};

const sectionDotInitial: SectionDotInterface = {
  sectionId: SectionID.HOME_BANNER,
};

const toastInitial: ToastsInterface = {
  toastIdCounter: 0,
  toasts: [],
};

export const getUserProfile = createAsyncThunk('main/getUserProfile', async () => {
  const res = await getProfile();
  const tenantData = await getTenantByIdAPI(res.data?.tenant);
  return { ...res.data, tenant_logo: tenantData.data.logo };
});

export const getWelcomeInfo = createAsyncThunk('backgroundData/getWelcomeInfo', async () => {
  const res = await doGetWelcomeInfo();
  return res.data[0];
});

export const sideBarSlice = createSlice({
  name: 'sideBar',
  initialState: sideBarInitial,
  reducers: {
    updateSideBar: (state, action: PayloadAction<boolean>) => {
      state.isExpand = action.payload;
    },
  },
});

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    updateUserInfo: (state, action: PayloadAction<UserProfile>) => {
      state.userInfo = action.payload;
    },
    resetUserInfo: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getUserProfile.fulfilled, (state, { payload }) => {
      state.userInfo = payload;
      localStorage.setItem(ScopeKey.IS_AUTHENTICATED, ScopeValue.TRUE);
      localStorage.setItem(ScopeKey.IS_SYSTEM_ADMIN, state.userInfo?.is_superuser ? ScopeValue.TRUE : ScopeValue.FALSE);
    });
  },
});

export const langSlice = createSlice({
  name: 'lang',
  initialState: langInitial,
  reducers: {
    updateLang: (state, action: PayloadAction<string>) => {
      state.curLang = action.payload;
    },
  },
});

export const backgroundDataSlice = createSlice({
  name: 'backgroundData',
  initialState: backGroundDataInitial,
  reducers: {
    updateBackgroundData: (state, action: PayloadAction<AuthWelcomeInfo>) => {
      state.backgroundData = action.payload;
    },
    resetBackgroundData: (state) => backGroundDataInitial,
  },
  extraReducers: (builder) => {
    builder.addCase(getWelcomeInfo.fulfilled, (state, { payload }) => {
      state.backgroundData = payload;
    });
  },
});

export const sectionDotSlice = createSlice({
  name: 'sectionDot',
  initialState: sectionDotInitial,
  reducers: {
    updateSectionDot: (state, action: PayloadAction<SectionID | undefined>) => {
      state.sectionId = action.payload;
    },
  },
});

export const toastsSlice = createSlice({
  name: 'toasts',
  initialState: toastInitial,
  reducers: {
    // Add toast to list toast
    addToast: (state, action: PayloadAction<ToastItem>) => {
      const toastId = state.toastIdCounter + 1;
      const newToast: ToastItem = { ...action.payload, id: toastId };
      state.toastIdCounter = toastId;
      state.toasts = [...state.toasts, newToast];
    },
    // Remove toast from list toast
    removeToast: (state, action: PayloadAction<number>) => {
      const filteredToasts = state.toasts.filter((toast) => toast.id !== action.payload + 1);
      state.toasts = filteredToasts;
      state.toastIdCounter = filteredToasts.length > 0 ? state.toastIdCounter - 1 : 0;
    },
    // Close current toast
    closeToast: (state, action: PayloadAction<number>) => {
      const filteredToasts = state.toasts.filter((toast) => toast.id !== action.payload);
      state.toasts = filteredToasts;
      state.toastIdCounter = filteredToasts.length > 0 ? state.toastIdCounter - 1 : 0;
    },
  },
});

export const { updateUserInfo, resetUserInfo } = mainSlice.actions;
export const { updateSideBar } = sideBarSlice.actions;
export const { updateLang } = langSlice.actions;
export const { updateBackgroundData, resetBackgroundData } = backgroundDataSlice.actions;
export const { updateSectionDot } = sectionDotSlice.actions;
export const { addToast, removeToast, closeToast } = toastsSlice.actions;
