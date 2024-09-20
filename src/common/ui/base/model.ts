/** @format */

import { ReactNode } from "react";

export interface OptionItem {
  title: string;
  value: string;
  elem?: ReactNode;
  selected: boolean;
}

export interface SelectedItem {
  title: string;
  value: string;
}

export interface SelectOption {
  label: string;
  value: string | number;
}
