/** @format */

import { ReactNode } from "react";

import { PageURL, PopupLevel, SectionID, ToastPosition, ToastType } from "../../../models/enum";
import { IconMapName } from "../assets/icon";

export interface Shortcut {
  name: string;
  url: PageURL | string;
  isActive: boolean;
  subName?: Array<Shortcut>;
  icon?: string | keyof typeof IconMapName;
  isDisabled?: boolean
  iconSelected?: string;
  isSubItemShow?: boolean;
  target?: React.MutableRefObject<HTMLDivElement | null>;
}

export interface SubName {
  url: PageURL | string;
  name: string;
  isActive?: boolean;
}

export interface NavItem extends Pick<Shortcut, "name" | "url" | "isActive"> { sectionId: SectionID }

export interface MegaMenuItem {
  isActive: boolean,
  isDisabled: boolean,
  isTitle: boolean,
  url?: PageURL | string
  icon?: string,
  sectionId?: SectionID
  subName?: { [key: string]: MegaMenuItem }
}

export interface ConfirmBtnGroupConfig {
  confirmTitle?: string;
  confirmClass?: string;
  cancelTitle?: string;
}

export interface Popup {
  title: ReactNode;
  content: ReactNode;
  level: PopupLevel;
  isCloseFlag?: boolean;
  id?: number | string;
}

export interface Confirm extends Popup {
  labelBtnCfm?: string;
  labelBtnCancel?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  onClose?: () => void;
}

export interface Alert extends Popup {
  labelBtnCfm?: string;
  onConfirm?: () => void;
  onClose?: () => void;
}

export interface TabItem {
  name: string;
  contentId: string;
}

export interface ToastItem {
  id?: number;
  title?: string;
  type: ToastType;
  message?: ReactNode;
  duration?: number;
  position?: ToastPosition;
  children?: ReactNode
  onClose?: (id: number) => void;
}