/** @format */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { SysConfig } from "./models";
import { getConfig } from "./api";

interface SysConfigInitial {
  sysConfig: SysConfig | null;
}

const initialState: SysConfigInitial = {
  sysConfig: null,
};

export const getSysConfig = createAsyncThunk(
  "system/getSysConfig",
  async () => {
    const res = await getConfig();
    return res.data;
  }
);

export const sysSlice = createSlice({
  name: "sys",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSysConfig.fulfilled, (state, { payload }) => {
      state.sysConfig = payload;
    });
  },
});
