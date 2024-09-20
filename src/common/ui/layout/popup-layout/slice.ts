/** @format */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PopupLevel } from "../../../../models/enum";
import { Alert, Confirm } from "../model";

interface PopupSliceInitial {
  alert: Alert;
  confirm: Confirm;
}

const initialState: PopupSliceInitial = {
  alert: { title: null, content: null, level: PopupLevel.INFO },
  confirm: { title: null, content: null, level: PopupLevel.INFO },
};

export const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    updateAlert: (state, action: PayloadAction<Alert>) => {
      state.alert = action.payload;
    },
    resetAlert: (state) => {
      state.alert = { title: null, content: null, level: PopupLevel.INFO };
    },

    updateConfirm: (state, action: PayloadAction<Confirm>) => {
      state.confirm = action.payload;
    },
    resetConfirm: (state) => {
      state.confirm = { title: null, content: null, level: PopupLevel.INFO };
    },
    resetPopup: (state) => initialState,
  },
});

export const {
  updateAlert,
  resetAlert,
  updateConfirm,
  resetConfirm,
  resetPopup,
} = popupSlice.actions;
