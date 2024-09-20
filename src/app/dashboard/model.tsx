/** @format */

import { AIFeature as AIFeatureId, RequestLimitType } from '../../models/enum';

export interface TenantInfo {
  id: string;
  name: string;
  alias: string;
  logo: string;
  default_pool: string;
}

export interface AIFeaturePackage {
  id: string;
  name: string;
  created_at: Date;
}

export interface AIFeature {
  id: AIFeatureId;
  name: string;
}

export interface AIAPIKey {
  id: string;
  api_key: string;
  limit_type: RequestLimitType;
  tenant: TenantInfo;
  package?: AIFeaturePackage;
  ai_feature?: AIFeature;
  web_hook_url?: string;
  type: number;
  request_limit?: number;
  total_used: number;
}

export interface License {
  id: string;
  tenant: string;
  enabled: boolean;
  created_at: string;
  ai_feature: AIFeature;
  request_limit: number;
  total_used: number;
}

export interface AIFeatureItem {
  ai_feature: number;
  limit_type: RequestLimitType;
  request_limit: number;
  isLimit?: boolean;
  isDuplicated?: boolean;
}

export interface Package {
  id: string;
  name: string;
}
