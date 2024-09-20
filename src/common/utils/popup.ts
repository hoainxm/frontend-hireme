/** @format */

import { ReactNode } from "react";
import { PopupLevel } from "../../models/enum";
import { store } from "../../models/store";
import { updateAlert, updateConfirm } from "../ui/layout/popup-layout/slice";
import { Alert as AlertModel, Confirm as ConfirmModel } from '../ui/layout/model'

export interface AlertAction extends Omit<AlertModel, 'level'> { }

export interface ConfirmAction extends Omit<ConfirmModel, 'level'> { }

export class Alert {
  static info(action: AlertAction) {
    store.dispatch(
      updateAlert({ ...action, level: PopupLevel.INFO })
    );
  }

  static success(action: AlertAction) {
    store.dispatch(
      updateAlert({ ...action, level: PopupLevel.SUCCESS })
    );
  }

  static warning(action: AlertAction) {
    store.dispatch(
      updateAlert({ ...action, level: PopupLevel.WARNING })
    );
  }

  static error(action: AlertAction) {
    store.dispatch(
      updateAlert({ ...action, level: PopupLevel.ERROR })
    );
  }

  static comingSoon(action: AlertAction) {
    store.dispatch(
      updateAlert({ ...action, level: PopupLevel.COMING_SOON })
    );
  }
}

export class Confirm {
  static danger(action: ConfirmAction) {
    store.dispatch(updateConfirm({ ...action, level: PopupLevel.DANGER }));
  }

  static delete(action: ConfirmAction) {
    store.dispatch(updateConfirm({ ...action, level: PopupLevel.DELETE }));
  }

  static logout(action: ConfirmAction) {
    store.dispatch(updateConfirm({ ...action, level: PopupLevel.LOGOUT }));
  }

  static success(action: ConfirmAction) {
    store.dispatch(updateConfirm({ ...action, level: PopupLevel.SUCCESS }));
  }

  static info(action: ConfirmAction) {
    store.dispatch(updateConfirm({ ...action, level: PopupLevel.INFO }));
  }

  static warning(
    title: ReactNode,
    content: ReactNode,
    onConfirm?: () => void,
    onCancel?: () => void,
    labelBtnCfm?: string,
    labelBtnCancel?: string
  ) {
    store.dispatch(
      updateConfirm({
        title,
        content,
        level: PopupLevel.WARNING,
        labelBtnCancel,
        labelBtnCfm,
        onCancel,
        onConfirm,
      })
    );
  }
}

