import { ScopeValue } from '@models/enum';

export const ROLES = [
  {
    _id: '66373e557f14689e42416321',
    name: 'SUPER_ADMIN',
    description: 'Admin được full quyền sử dụng hệ thống',
  },
  {
    _id: '66373e557f14689e42416322',
    name: 'NORMAL_USER',
    description: 'Người dùng/Ứng viên sử dụng hệ thống',
  },
  {
    _id: '66376960e60f6eda1161fdf2',
    name: 'HR',
    description: 'HR chỉ được view resume + companies',
  },
];

export const PremiumPlanMapping: { [key: string]: string } = {
  [ScopeValue.LITE]: 'Lite',
  [ScopeValue.PLUS]: 'Plus',
  [ScopeValue.MAX]: 'Max',
};

export const PREMIUM_RANKING: Record<ScopeValue, number> = {
  [ScopeValue.LITE]: 1,
  [ScopeValue.PLUS]: 2,
  [ScopeValue.MAX]: 3,
  [ScopeValue.TRUE]: 0,
  [ScopeValue.FALSE]: 0,
  [ScopeValue.VIE]: 0,
  [ScopeValue.ENG]: 0,
  [ScopeValue.AUTOMATE]: 0,
  [ScopeValue.NO_AUTOMATE]: 0,
};
