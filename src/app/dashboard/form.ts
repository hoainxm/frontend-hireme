/** @format */

import { AIFeatureItem } from './model';

export interface APIKeyFilterForm {
  tenant: Array<string>;
  package: Array<string>;
}

export interface APIKeyForm {
  id?: string;
  tenant: string;
  package?: string;
  ai_feature?: number;
  web_hook_url?: string;
  type: number;
  limit_type?: number;
  request_limit?: number;
}

export interface PackageForm {
  name: string;
  features: Array<AIFeatureItem>;
}
