import { AIFeature } from "../dashboard/model";

export interface License {
  id: string;
  tenant: string;
  enabled: boolean;
  created_at: string;
  ai_feature: AIFeature;
  request_limit: number;
  total_used: number;
}
