/** @format */

export enum ScopeKey {
  IS_AUTHENTICATED = '5Eo8lm11M2UBtWSfU3J5',
  IS_SYSTEM_ADMIN = '64vdFNC8Xb7KZrbEXQ52',
  LANG = '7XFJt971uBVOaBwFVXSX',
  AUTOMATE_AUTH = 'vNHYihMUVfimkeb99h31',
  ACCESS_TOKEN = '6HNS8VCz8GELPSDaP4FC',
  USER = 'ffcs8VCz8VFSGTDa3dfx',
  SELECTED_SECTION_DOT = 'c2VsZWN0ZWRJdGVt',
  COUNT_DOWN = 'Y291bnRkb3du',
}

export enum ScopeValue {
  TRUE = 'FVCHbxMAxePUFQG0tcDV',
  FALSE = 'GVTYYVDF0cFVNJiZ1eu2',
  VIE = 'iRJMDFmHKy4S3jXGqSFX',
  ENG = 'FClcBFF0I7m8YRWXqFDV',
  AUTOMATE = 'dHJ1ZQ==',
  NO_AUTOMATE = 'ZmFsc2U=',
}

export enum PageURL {
  // User
  HOME = '/',
  PRODUCT = '/product',
  ABOUT_US = '/about',
  NEWS = '/news',
  JOBS = '/jobs',
  JOB_DETAIL = '/jobs/:jobId',
  SAVE_JOBS = '/saveJobs/',
  UPGRADE = '/upgrade/',

  COMPANY = '/companies/',
  COMPANY_DETAIL = '/companies/:companyId',

  CATEGORY = '/news/categories',
  PROFILE_MANAGEMENT = '/profile',
  LICENSE_MANAGEMENT = '/license-management',

  PRODUCT_OVERVIEW = '/:process/:program/:feature',

  // Product
  PRODUCT_COMPUTER_VISION = '/product/computer-vision',
  PRODUCT_OCR = '/product/computer-vision/ocr',
  PRODUCT_OD = '/product/computer-vision/od',

  // Authentication
  LOGIN = '/login',
  REGISTER = '/register',
  FORGOT_PASSWORD = '/forgot-password',
  RESET_PASSWORD = '/reset-password/:token',
  RESEND_VERIFY_EMAIL = '/resend-verify-email',
  VERIFY_EMAIL = '/verify-email',
  PRIVACY_POLICY = '/privacy-policy',
  COMPUTER_VISION = '/computer-vision',

  // OCR
  OCR = '/computer-vision/ocr',
  OCR_MEDICAL_DEVICE = '/computer-vision/ocr/medical-device',
  OCR_IN_BODY = '/computer-vision/ocr/inbody',
  OCR_CARD_ID = '/computer-vision/ocr/id-card',
  OCR_BILL = '/computer-vision/ocr/bill',
  OCR_PRESCRIPTION = '/computer-vision/ocr/prescription',
  OCR_LICENSE_PLATE = '/computer-vision/ocr/license-plate',
  OCR_DYNAMIC_TEMPLATE = '/computer-vision/ocr/dynamic-template',
  OCR_DYNAMIC_TEMPLATE_CREATE = '/computer-vision/ocr/create-dynamic-template',
  OCR_DYNAMIC_TEMPLATE_UPDATE = '/computer-vision/ocr/update-dynamic-template',
  OCR_DYNAMIC_TEMPLATE_RESULT = '/computer-vision/ocr/result-dynamic-template',
  AUDIO_PROCESSING = '/audio-processing/tts/',
  TEXT_TO_SPEECH = '/audio-processing/tts/text-to-speech',

  OD = '/computer-vision/od',

  // Admin
  ADMIN = '/admin',
  ADMIN_LOGIN = '/admin/login',
  ADMIN_AI_PACKAGE_WRITER = '/ai-cloud-features/ai-package/:action',
  ADMIN_AI_PACKAGE_INFO = '/ai-cloud-features/ai-package/:action/:id',
  ADMIN_AI_API_KEY = '/cloud-api-key',
  ADMIN_AI_API_KEY_WRITER = '/cloud-api-key/:action',
  ADMIN_AI_PACKAGE = '/ai-cloud-features/ai-package',
  ADMIN_WELCOME_INFORM = '/admin/welcome-inform',
  ADMIN_TENANT = '/admin/tenant',

  AI_CLOUD_FEATURE_MANAGEMENT = '/ai-cloud-features',
}

export enum PageName {
  // User
  HOME = 'user.home',
  JOBS = 'user.jobs',
  SAVE_JOBS = 'user.savedJobs',
  COMPANY = 'user.company',

  UPGRADE = 'user.upgrade',
  CHANGE_PASSWORD = 'user.changePassword',

  PRODUCT = 'user.product',
  ABOUT_US = 'user.aboutUs',
  NEWS = 'user.news',

  PROFILE_MANAGEMENT = 'user.profile.management',
  LICENSE_MANAGEMENT = 'user.license.management',

  // Product
  // COMPUTER_VISION = 'product.computerVision',
  // NATURAL_LANGUAGE = 'product.naturalLanguage',
  // DATA_ANALYTICS = 'product.dataAnalytics',
  // AUDIO_SPEECH = 'product.speechProcessing',

  // OCR = 'product.ocr',
  // OCR_MEDICAL_DEVICE = 'product.ocr.medicalDevice',
  // OCR_IN_BODY = 'product.ocr.inBody',
  // OCR_CARD_ID = 'product.ocr.idCard',
  // OCR_BILL = 'product.ocr.bill',
  // OCR_PRESCRIPTION = 'product.ocr.prescription',
  // OCR_LICENSE_PLATE = 'product.ocr.licensePlate',
  // OCR_DYNAMIC_TEMPLATE = 'product.ocr.dynamicTemplate',
  // OCR_DYNAMIC_TEMPLATE_CREATE = 'product.ocr.createDynamicTemplate',

  // OD = 'product.od',
  // OD_FACE_RECOGNITION = 'product.od.faceRecognition',
  // OD_OBJECT_TRACKING = 'product.od.objectDetection',
  // OD_FACIAL_EXPRESS_RECOGNITION = 'product.od.facialExpressionRecognition',
  // OD_AGE_GENDER_PREDICTION = 'product.od.agePrediction',
  // OD_ACTION_RECOGNITION = 'product.od.actionRecognition',
  // TEXT_TO_SPEECH = 'product.speechProcessing.textToSpeech',
  // SPEECH_TO_TEXT = 'product.speechProcessing.speechToText',

  // Admin
  ADMIN_DASHBOARD = 'admin.home',
  WELCOME_INFORM_MANAGEMENT = 'admin.inform.title',
  TENANT_MANAGEMENT = 'admin.tenant.tenantManagement',
}

export enum ProductLabel {
  COMPUTER_VISION = 'product.computerVision',
  NATURAL_LANGUAGE = 'product.naturalLanguage',
  DATA_ANALYTICS = 'product.dataAnalytics',
  AUDIO_SPEECH = 'product.speechProcessing',
  OCR = 'product.ocr',
  OCR_MEDICAL_DEVICE = 'product.ocr.medicalDevice',
  OCR_IN_BODY = 'product.ocr.inBody',
  OCR_CARD_ID = 'product.ocr.idCard',
  OCR_BILL = 'product.ocr.bill',
  OCR_PRESCRIPTION = 'product.ocr.prescription',
  OCR_LICENSE_PLATE = 'product.ocr.licensePlate',

  OD = 'product.od',
  OD_FACE_RECOGNITION = 'product.od.faceRecognition',
  OD_OBJECT_TRACKING = 'product.od.objectDetection',
  OD_FACIAL_EXPRESS_RECOGNITION = 'product.od.facialExpressionRecognition',
  OD_AGE_GENDER_PREDICTION = 'product.od.agePrediction',
  OD_ACTION_RECOGNITION = 'product.od.actionRecognition',
}

export enum AIFeature {
  PEOPLE_DETECTION = 1,
  FACE_DETECTION = 2,
  FACE_ID = 3,
  OCR_CARD_ID = 4,
  OCR_PASSPORT = 5,
  OCR_HEALTH_DEVICE = 6,
  OCR_HEALTH_IDENTIFICATION = 7,
  OCR_IN_BODY = 8,
  OCR_PRESCRIPTION = 9,
  OCR_CARD_PASSPORT = 10,
  OCR_DYNAMIC_TEMPLATE = 11,
  TEXT_TO_SPEECH = 12,
}

export enum MedicalDeviceStatusCode {
  SUCCESS = '200',
  NOT_FIND_SCREEN_CONTOUR = '460',
  NOT_FIND_DEVICE_SCREEN = '461',
  NOT_EXTRACT_TEXT = '462',
  NOT_SUPPORT_DEVICE = '463',
  MISSING_PULSE = '464',
  BLURRY_IMAGE = '465',
  BOX_DOES_NOT_CORRESPOND_THE_TEMPLATE = '466',
  DEVICE_NOT_IN_TEMPLATE = '467',
  EMPTY_TEMPLATE_LIST = '468',
  NOT_REMOVE_PUBLIC_TEMPLATE = '469',
  NOT_EDIT_PUBLIC_TEMPLATE = '470',
  EMPTY_LABEL_BOX = '471',
  DEVICE_NOT_SUPPORT_TENANT = '472',
  NO_IMAGE_OR_INCORRECT_URL = '473',
}

export enum MedicalDeviceMeasureFunctions {
  BG = 'BG',
  BP = 'BP',
  TEMPERATURE = 'TEMPERATURE',
}

export enum InbodyStatusCode {
  SUCCESS = '200',
  NOT_FIND_TEXT = '460',
  NOT_RECOGNIZE_TEXT = '461',
  BLURRY_IMAGE = '465',
  NO_SUPPORT_THIS_TEMPLATE = '470',
  INVALID_TEMPLATE = '471',
  NO_IMAGE_OR_INCORRECT_URL = '473',
}

export enum PrescriptionStatusCode {
  SUCCESS = '200',
  NOT_FIND_TEXT = '460',
  NOT_RECOGNIZE_TEXT = '461',
  ONLY_SUPPORT_TABLE_FORMAT = '470',
  NO_IMAGE_OR_INCORRECT_URL = '473',
  NO_SUPPORT_THIS_LANGUAGE = '474',
}

export enum DynamicStatusCode {
  SUCCESS = '200',
  NOT_SUPPORT_DEVICE = '463',
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

  OCR_BANNER = 'cHJvZHVjdE9jclBhZ2VCYW5uZXI',
  OCR_WHY = 'cHJvZHVjdE9jclBhZ2VXaHk',
  OCR_MD = 'cHJvZHVjdE9jclBhZ2VNZWRpY2FsRGV2aWNl',
  OCR_IB = 'cHJvZHVjdE9jclBhZ2VJbmJvZHk',
  OCR_PRESCRIPTION = 'cHJvZHVjdE9jclBhZ2VQcmVzY3JpcHRpb24',
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

export enum APICloudFeatureTabs {
  PACKAGE = 'aipackage.management',
  APIKEY = 'ai.apikey.management',
}

export enum LicenseManagementTabs {
  FREE = 'free',
  PAID = 'paid',
}

export enum TrialFeatureTabs {
  DESCRIPTION = 'description',
  TRIAL = 'trial',
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

export enum DocumentType {
  LCD = 'lcd',
  PAPER = 'form',
}

export enum DynamicTemplateAction {
  DISPLAY = 'display',
  REGISTER = 'register',
  RECOGNIZE = 'recognize',
  DELETE = 'delete',
  UPDATE = 'edit',
}
