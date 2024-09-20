/** @format */

import { PageURL } from "../models/enum";

export interface SysConfig {
  is_cloud: boolean;
}

export interface RouteModel {
  path: PageURL;
  component: React.FC<any>;
}
