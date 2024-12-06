/** @format */

export enum ScopeKey {
  IS_AUTHENTICATED = '5Eo8lm11M2UBtWSfU3J5',
  IS_SYSTEM_ADMIN = '64vdFNC8Xb7KZrbEXQ52',
  IS_SYSTEM_HR = 'SVNfU1lTVEVNX0hS',
  LANG = '7XFJt971uBVOaBwFVXSX',
  AUTOMATE_AUTH = 'vNHYihMUVfimkeb99h31',
  ACCESS_TOKEN = '6HNS8VCz8GELPSDaP4FC',
  USER = 'ffcs8VCz8VFSGTDa3dfx',
  SELECTED_SECTION_DOT = 'c2VsZWN0ZWRJdGVt',
  COUNT_DOWN = 'Y291bnRkb3du',
  IS_PREMIUM_SECTION = 'aXNfcHJlbWl1bV9zZWN0aW9u',
}

export enum ScopeValue {
  TRUE = 'FVCHbxMAxePUFQG0tcDV',
  FALSE = 'GVTYYVDF0cFVNJiZ1eu2',
  VIE = 'iRJMDFmHKy4S3jXGqSFX',
  ENG = 'FClcBFF0I7m8YRWXqFDV',
  AUTOMATE = 'dHJ1ZQ==',
  NO_AUTOMATE = 'ZmFsc2U=',
  LITE = 'bGl0ZQ==',
  PLUS = 'cGx1cw==',
  MAX = 'bWF4',
}

export enum PageURL {
  // User
  HOME = '/',
  PRODUCT = '/product',
  ABOUT_US = '/about',
  NEWS = '/news',
  JOBS = '/jobs',
  JOB_DETAIL = '/jobs/:jobId',
  SAVED_JOBS = '/savedJobs',

  UPGRADE = '/upgrade',
  UPDATE_PASSWORD = '/update-password',
  COMPANY = '/companies',
  COMPANY_DETAIL = '/companies/:companyId',
  FOLLOWED_COMPANIES = '/followed-companies',
  CATEGORY = '/news/categories',
  PROFILE_MANAGEMENT = '/profile',
  PRODUCT_OVERVIEW = '/:process/:program/:feature',
  PAYMENT_STATUS = '/payment-status',

  // Authentication
  LOGIN = '/login',
  REGISTER = '/register',
  FORGOT_PASSWORD = '/forgot-password',
  RESET_PASSWORD = '/reset-password',
  RESEND_VERIFY_EMAIL = '/resend-verify-email',
  VERIFY_EMAIL = '/verify-email',
  PRIVACY_POLICY = '/privacy-policy',
  COMPUTER_VISION = '/computer-vision',

  // Admin
  ADMIN = '/admin',
  ADMIN_MANAGE = '/manage',
  ADMIN_MANAGE_USER = '/manage/user',
  ADMIN_MANAGE_COMPANY = '/manage/company',
  ADMIN_MANAGE_JOB = '/manage/job',
  ADMIN_MANAGE_CV = '/manage/cvs',
  ADMIN_MANAGE_PERMISSION = '/manage/permission',
  ADMIN_MANAGE_ROLE = '/manage/role',

  // HR
  HR_MANAGE = '/manage/hr',
}

export enum PageName {
  // User
  HOME = 'user.home',
  JOBS = 'user.jobs',
  SAVED_JOBS = 'user.savedJobs',
  COMPANY = 'user.company',
  UPGRADE = 'user.upgrade',
  CHANGE_PASSWORD = 'user.changePassword',
  HR_DASHBOARD = 'hr.management',
  PRODUCT = 'user.product',
  ABOUT_US = 'user.aboutUs',
  NEWS = 'user.news',
  UPDATE_PASSWORD = 'user.updatePassword',
  PROFILE_MANAGEMENT = 'user.profile.management',

  // Admin
  ADMIN_DASHBOARD = 'admin.home',
  ADMIN_MANAGE_USER = 'field.admin.user',
  ADMIN_MANAGE_CV = 'field.admin.cv',
  ADMIN_MANAGE_JOB = 'field.admin.job',
  ADMIN_MANAGE_COMPANY = 'field.admin.company',
  ADMIN_MANAGE_PERMISSION = 'field.admin.permission',
  ADMIN_MANAGE_ROLE = 'field.admin.role',

  HR_MANAGE = 'field.hr.management',
  WELCOME_INFORM_MANAGEMENT = 'admin.inform.title',
  FOLLOWED_COMPANIES = 'followed.company',
}

export enum HTTPStatusCode {
  SUCCESS = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
  BAD_GATEWAY = 502,
}

export enum SectionID {
  HOME_BANNER = 'aG9tZVBhZ2VCYW5uZXI',
  HOME_CV = 'aG9tZVBhZ2VDb21wdXRlclZpc2lvbg',
  // HOME_NLP = 'aG9tZVBhZ2VOTFA',
  HOME_UPDATE = 'aG9tZVBhZ2VOTFA',
  HOME_DA = 'aG9tZVBhZ2VEYXRhQW5hbHl0aWNz',
  HOME_AS = 'aG9tZVBhZ2VBdWRpb1NwZWVjaA',
  HOME_PROJECT = 'aG9tZVBhZ2VQcm9qZWN0cw',
  HOME_SERVICE = 'aG9tZVBhZ2VTZXJ2aWNl',
  HOME_PARTNERS = 'aG9tZVBhZ2VQYXJ0bmVycw',
  HOME_WHY = 'aG9tZVBhZ2VXaHk',
}

export enum ButtonSize {
  NORMAL = 'normal',
  LARGE = 'large',
}

export enum ButtonType {
  PRIMARY = 'primary',
}

export enum ButtonVariant {
  CONTAINED = 'contained',
  OUTLINE = 'outline',
  GHOST = 'ghost',
  LINK = 'link',
}

export enum ToastType {
  SUCCESS,
  WARNING,
  ERROR,
  INFO,
}

export enum ToastPosition {
  TOP_RIGHT = 'topRight',
  BOTTOM_RIGHT = 'bottomRight',
}

export enum PopupLevel {
  INFO,
  SUCCESS,
  WARNING,
  ERROR,
  DANGER,
  DELETE,
  LOGOUT,
  RESET_PASSWORD,
  COMING_SOON,
  LOADING,
  AUTHENTICATE,
}

export enum AdminManageTabs {
  ADMIN = 'admin',
  USER = 'field.admin.user',
  COMPANY = 'field.admin.company',
  JOBS = 'field.admin.job',
  CV = 'field.admin.cv',
  PERMISSION = 'field.admin.permission',
  ROLE = 'field.admin.role',
  STATISTICAL = 'field.admin.statistical',
}

export enum PrescriptionLanguage {
  VIETNAMESE = 'vi1',
  ENGLISH = 'en',
}

export enum RequestLimitType {
  REQUEST,
  MONTH,
  DAY,
}

export enum FormAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum ImportImageStyle {
  NORMAL,
  CIRCLE,
  DASHED,
}

export enum Palette {
  BLUE = 'blue',
  BLACK = 'black',
  RED = 'red',
  WHITE = 'white',
  ORIGIN = 'origin', // origin: use for image without fill color
  FIRST_GRAY = 'firstGray',
  FOURTH_GRAY = 'fourthGray',
  FIFTH_GRAY = 'fifthGray',
}

export enum Color {
  SECONDARY,
  DANGER,
  SUCCESS,
  WARNING,
  BLUE,
  ORANGE,
  LIGHT_RED,
  GRAY,
}

export enum StatusOptionColor {
  GREEN,
  LIGHT_BLUE,
  BLUE,
  ORANGE,
  RED,
  GRAY,
}
