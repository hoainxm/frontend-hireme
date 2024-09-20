/** @format */

import { PageName, PageURL } from "../../../../models/enum";

import Dashboard from "../../assets/ic/24px/dashboard/ui.svg";
import DashboardBlue from "../../assets/ic/24px/dashboard/ui_blue.svg";
import Home from "../../assets/ic/24px/dashboard/home.svg";
import HomeBlue from "../../assets/ic/24px/dashboard/home-blue.svg";
import { Shortcut } from "../model";
import Staff from "../../assets/ic/24px/dashboard/staff.svg";
import StaffBlue from "../../assets/ic/24px/dashboard/staffBlue.svg";

export const shortcutData: Shortcut[] = [
  {
    name: PageName.ADMIN_DASHBOARD,
    url: PageURL.ADMIN,
    icon: Home,
    iconSelected: HomeBlue,
    isActive: false,
  },
  {
    name: PageName.WELCOME_INFORM_MANAGEMENT,
    url: PageURL.ADMIN_WELCOME_INFORM,
    icon: Dashboard,
    iconSelected: DashboardBlue,
    isActive: false,
  },
  {
    name: PageName.TENANT_MANAGEMENT,
    url: PageURL.ADMIN_TENANT,
    icon: Staff,
    iconSelected: StaffBlue,
    isActive: false,
  },
];
