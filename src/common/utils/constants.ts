/** @format */

import { AIFeature, PageName, PageURL, ProductLabel, RequestLimitType, SectionID } from '../../models/enum';

import { MegaMenuItem } from '../ui/layout/model';
import { SelectOption } from '@base/model';

const URL_WITH_PORT = `${window.location.protocol}//${window.location.hostname}:${process.env.REACT_APP_API_PORT}`;

export const BASE_URL =
  process.env.REACT_APP_IS_PROD == 'true' && process.env.REACT_APP_API_PORT
    ? URL_WITH_PORT
    : process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL
    : window.location.origin;

export const YOUTUBE_EMBEDDED_URL = 'https://www.youtube.com/embed/';

//flatpickr library requires this type: [string, string,....]
export const DAY_OF_WEEK: [string, string, string, string, string, string, string] = [
  'field.dayInWeek.sun',
  'field.dayInWeek.mon',
  'field.dayInWeek.tue',
  'field.dayInWeek.wed',
  'field.dayInWeek.thu',
  'field.dayInWeek.fri',
  'field.dayInWeek.sat',
];

//flatpickr library requires this type: [string, string,....]
export const MONTHS: [string, string, string, string, string, string, string, string, string, string, string, string] = [
  'month.1',
  'month.2',
  'month.3',
  'month.4',
  'month.5',
  'month.6',
  'month.7',
  'month.8',
  'month.9',
  'month.10',
  'month.11',
  'month.12',
];

export const DEFAULT_PAGE_SIZE_LIST = [10, 20, 30, 50, 100];

export const HIDDEN_COL = 'isHidden';

export const NOT_SET = '--';

export const HD_CHARACTER_RECOGNITION = '~ 99%';

export const HD_FIELDS_EXTRACTION = '~ 97%';

export const INBODY_CHARACTER_RECOGNITION = '~ 99%';

export const INBODY_FIELDS_EXTRACTION = '~ 94%';

export const PRESCRIPTION_CHARACTER_RECOGNITION = '~ 99%';

export const PRESCRIPTION_FIELDS_EXTRACTION = '~ 90%';

export const PermissionDeny: { [key: string]: string } = {
  'You do not have permission to perform this action.': 'permission.deny',
};

export const DECIMAL_NUMBER_PATTERN: RegExp = /^[0-9]\d*(\.\d+)?$/;

export const NORMAL_NUMBER_PATTERN: RegExp = /^[0-9]*$/;

export const NORMAL_CHARACTER: RegExp = /[a-z]+\b/;

export const EMAIL_PATTERN: RegExp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const PHONE_DETAIL_PATTERN: RegExp = /^[0-9*()\s]+$/;

export const NORMAL_CHAR_PATTERN: RegExp = /^[A-Za-z0-9\s\p{Letter}']+$/iu;

export const USERNAME_PATTERN = /^[A-Za-z][A-Za-z0-9]+$/;

export const PASS_PATTERN: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

export const PASSWORD_MAX_LENGTH: RegExp = /.{8,}/;

export const UPPERCASE_ONLY_PATTERN: RegExp = /[A-Z]/;

export const LOWERCASE_ONLY_PATTERN: RegExp = /[a-z]/;

// export const SPECIAL_ONLY_PATTERN: RegExp = /^(?:[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]|^\S*$)$/;

export const SPECIAL_ONLY_PATTERN: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

export const NUMERIC_ONLY_PATTERN: RegExp = /\d/;

export type TYPE_SORT = 'asc' | 'none' | 'desc';

export const NEXT_SORT: { [key in TYPE_SORT]: TYPE_SORT } = {
  desc: 'asc',
  asc: 'none',
  none: 'desc',
};
export const DEFAULT_PAGE = {
  dbPageSize: 10,
  devicePageSize: 10,
  rfidPageSize: 10,
  staffPageSize: 10,
  departmentPageSize: 10,
  visPageSize: 10,
  appointmentPageSize: 10,
  shiftPageSize: 10,
  flexbileShiftPageSize: 10,
  dOTPageSize: 10,
  dOffPageSize: 10,
  schedulePageSize: 10,
};

export const DEFAULT_PAGE_NUM = {
  dbPageNum: 1,
  devicePageNum: 1,
  staffPageNum: 1,
  departmentPageNum: 1,
  visPageNum: 1,
  appointmentPageNum: 1,
  shiftPageNum: 1,
  flexbileShiftPageNum: 1,
  dOTPageNum: 1,
  dOffPageNum: 1,
  schedulePageNum: 1,
};

export const ROLE: { [key: string]: string } = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  SUPER_ADMIN: 'SUPER ADMIN',
};

export const AI_FEATURE_TRANSLATE: { [key: string]: string } = {
  people_detection: 'aipackage.peopleDetection',
  face_detection: 'aipackage.faceDetection',
  face_id: 'aipackage.faceId',
  ocr_id_card: 'aipackage.cardIdOCR',
  ocr_passport: 'aipackage.passportOCR',
  ocr_health_device: 'aipackage.ocrhd',
  ocr_health_identification: 'aipackage.ocrhi',
  ocr_in_body: 'aipackage.ocr.inbody',
  ocr_prescription: 'aipackage.ocr.prescription',
  ocr_card_passport: 'aipackage.ocr.cardpassport',
  ocr_dynamic: 'aipackage.ocr.dynamicTemplate',
};

export const LIMIT_TYPE_TRANSLATE: { [key: string]: string } = {
  [RequestLimitType.REQUEST]: 'aipackage.limitBy.total',
  [RequestLimitType.MONTH]: 'aipackage.limitBy.month',
  [RequestLimitType.DAY]: 'aipackage.limitBy.day',
};

export const COUNT_DOWN = {
  // Count per second
  RESEND_EMAIL: 30,
  FORGOT_PASSWORD: 30,
  TOAST_DURATION: 5000,
};

export const NAV_ITEMS = [
  {
    name: PageName.HOME,
    url: PageURL.HOME,
    sectionId: SectionID.HOME_BANNER,
    isActive: false,
  },
  {
    name: PageName.JOBS,
    url: PageURL.JOBS,
    sectionId: SectionID.HOME_BANNER,
    isActive: true,
  },
  // {
  //   name: PageName.PRODUCT,
  //   url: PageURL.PRODUCT,
  //   sectionId: SectionID.HOME_BANNER,
  //   isActive: false,
  // },
  {
    name: PageName.COMPANY,
    url: PageURL.COMPANY,
    sectionId: SectionID.HOME_BANNER,
    isActive: false,
  },
  {
    name: PageName.ABOUT_US,
    url: PageURL.ABOUT_US,
    sectionId: SectionID.HOME_BANNER,
    isActive: false,
  },
  // {
  //   name: PageName.NEWS,
  //   url: PageURL.NEWS,
  //   sectionId: SectionID.HOME_BANNER,
  //   isActive: false,
  // },
];

export const SOCIAL_LINKS = [
  {
    url: 'https://www.facebook.com/hoainxm',
    icon: 'Facebook',
  },
  {
    url: 'https://www.linkedin.com/in/nampnh',
    icon: 'Linkedin',
  },
  {
    url: 'https://www.youtube.com/@hoainxm',
    icon: 'Youtube',
  },
];

export const PROFILE_ITEMS = [
  {
    name: PageName.PROFILE_MANAGEMENT,
    url: PageURL.PROFILE_MANAGEMENT,
    icon: 'ManageAccount',
    isActive: true,
  },
  {
    name: PageName.UPGRADE,
    url: PageURL.UPGRADE,
    icon: 'Upgrade',
    isActive: true,
  },
  {
    name: PageName.SAVE_JOBS,
    url: PageURL.SAVE_JOBS,
    icon: 'Save',
    isActive: true,
  },
  {
    name: PageName.CHANGE_PASSWORD,
    url: PageURL.UPDATE_PASSWORD,
    icon: 'ChangePassword',
    isActive: true,
  },
  // {
  //   name: PageName.LICENSE_MANAGEMENT,
  //   url: PageURL.LICENSE_MANAGEMENT,
  //   icon: 'License',
  //   isActive: false,
  // },
];

export const CONTACT_INFORMATION = [
  {
    icon: 'Phone',
    content: 'contact.information.phone',
  },
  {
    icon: 'Email',
    content: 'contact.information.email',
  },
  {
    icon: 'Address',
    content: 'contact.information.address',
  },
];

export const YOUTUBE_VIDEO_ID = {
  IPH: 'X3urIpumXWA',
  JP_TRAIN: '3c972T3c9xQ',
  VT_TRUCK: 'Rm7N2u--hYE',
  PARKING_LOT: 'OrxpmjrzQrQ',
  TLOCKER: '_kUBFIpvnxo',
  OCR_MCARE: '9P-MinjNlkE',
  DOCS_READER: 'FJ59JqGSnv4',
  CDP: '9ZyTxV5-hf0',
  MEDICAL_DEVICE: 'BwInvzcaQ28',
  INBODY: 'OjNjtQOMdUI',
};

export const TRIAL_LICENSE = 0;
export const PURCHASED_LICENSE = 1;

export const FORMAT_IMAGE_TYPE = ['image/png', 'image/jpeg', 'image/jpg'];

export const LICENSE_TYPE: Array<SelectOption> = [
  { label: 'field.licenseType.trial', value: TRIAL_LICENSE },
  { label: 'field.licenseType.purchase', value: PURCHASED_LICENSE },
];

export const FEATURE_MAPPING: { [key: string]: AIFeature } = {
  [PageURL.OCR_MEDICAL_DEVICE]: AIFeature.OCR_HEALTH_DEVICE,
  [PageURL.OCR_IN_BODY]: AIFeature.OCR_IN_BODY,
  [PageURL.OCR_PRESCRIPTION]: AIFeature.OCR_PRESCRIPTION,
  [PageURL.OCR_DYNAMIC_TEMPLATE]: AIFeature.OCR_DYNAMIC_TEMPLATE,
  [PageURL.OCR_DYNAMIC_TEMPLATE_CREATE]: AIFeature.OCR_DYNAMIC_TEMPLATE,
  [PageURL.OCR_DYNAMIC_TEMPLATE_RESULT]: AIFeature.OCR_DYNAMIC_TEMPLATE,
  [PageURL.OCR_DYNAMIC_TEMPLATE_UPDATE]: AIFeature.OCR_DYNAMIC_TEMPLATE,
  [PageURL.TEXT_TO_SPEECH]: AIFeature.TEXT_TO_SPEECH,
};

export const FEATURE_NAME_MAPPING: { [key in AIFeature]: string } = {
  [AIFeature.PEOPLE_DETECTION]: 'product.od.objectDetection',
  [AIFeature.FACE_DETECTION]: 'product.od.facialExpressionRecognition',
  [AIFeature.FACE_ID]: 'product.od.faceRecognition',
  [AIFeature.OCR_CARD_ID]: 'product.ocr.idCard',
  [AIFeature.OCR_PASSPORT]: '',
  [AIFeature.OCR_HEALTH_DEVICE]: 'product.ocr.medicalDevice',
  [AIFeature.OCR_HEALTH_IDENTIFICATION]: '',
  [AIFeature.OCR_IN_BODY]: 'product.ocr.inBody',
  [AIFeature.OCR_PRESCRIPTION]: 'product.ocr.prescription',
  [AIFeature.OCR_CARD_PASSPORT]: 'product.ocr.cardpassport',
  [AIFeature.OCR_DYNAMIC_TEMPLATE]: 'product.ocr.dynamicTemplate',
  [AIFeature.TEXT_TO_SPEECH]: 'product.speechProcessing.textToSpeech',
};

export const PRODUCT_ITEMS: { [key: string]: MegaMenuItem } = {
  [ProductLabel.COMPUTER_VISION]: {
    isActive: false,
    isDisabled: false,
    isTitle: true,
    url: '',
    subName: {
      [ProductLabel.OCR]: {
        isActive: false,
        isDisabled: false,
        isTitle: true,
        url: PageURL.PRODUCT_OCR,
        sectionId: SectionID.OCR_BANNER,
        subName: {
          [ProductLabel.OCR_MEDICAL_DEVICE]: {
            isActive: false,
            isDisabled: false,
            isTitle: false,
            url: PageURL.PRODUCT_OCR,
            sectionId: SectionID.OCR_MD,
            icon: 'MedicalDevice',
          },
          [ProductLabel.OCR_IN_BODY]: {
            isActive: false,
            isDisabled: false,
            isTitle: false,
            url: PageURL.PRODUCT_OCR,
            sectionId: SectionID.OCR_IB,
            icon: 'Inbody',
          },
          [ProductLabel.OCR_PRESCRIPTION]: {
            isActive: false,
            isDisabled: false,
            isTitle: false,
            url: PageURL.PRODUCT_OCR,
            sectionId: SectionID.OCR_PRESCRIPTION,
            icon: 'Prescription',
          },
          [ProductLabel.OCR_CARD_ID]: {
            isActive: false,
            isDisabled: true,
            isTitle: false,
            url: PageURL.PRODUCT_OCR,
            icon: 'IDCard',
          },
          [ProductLabel.OCR_BILL]: {
            isActive: false,
            isDisabled: true,
            isTitle: false,
            url: PageURL.PRODUCT_OCR,
            icon: 'Invoice',
          },
          [ProductLabel.OCR_LICENSE_PLATE]: {
            isActive: false,
            isDisabled: true,
            isTitle: false,
            url: PageURL.PRODUCT_OCR,
            icon: 'LicensePlate',
          },
        },
      },
      [ProductLabel.OD]: {
        isActive: false,
        isDisabled: false,
        isTitle: true,
        url: PageURL.PRODUCT_OD,
        subName: {
          [ProductLabel.OD_FACE_RECOGNITION]: {
            isActive: false,
            isDisabled: true,
            isTitle: false,
            url: PageURL.PRODUCT_OD,
            icon: 'FaceRecognition',
          },
          [ProductLabel.OD_FACIAL_EXPRESS_RECOGNITION]: {
            isActive: false,
            isDisabled: true,
            isTitle: false,
            url: PageURL.PRODUCT_OD,
            icon: 'Emotion',
          },
          [ProductLabel.OD_AGE_GENDER_PREDICTION]: {
            isActive: false,
            isDisabled: true,
            isTitle: false,
            url: PageURL.PRODUCT_OD,
            icon: 'AgeGender',
          },
          [ProductLabel.OD_OBJECT_TRACKING]: {
            isActive: false,
            isDisabled: true,
            isTitle: false,
            url: PageURL.PRODUCT_OD,
            icon: 'PeopleCounting',
          },
          [ProductLabel.OD_ACTION_RECOGNITION]: {
            isActive: false,
            isDisabled: true,
            isTitle: false,
            url: PageURL.PRODUCT_OD,
            icon: 'ActionRecognition',
          },
        },
      },
    },
  },
  [ProductLabel.NATURAL_LANGUAGE]: {
    isActive: true,
    isDisabled: false,
    isTitle: true,
  },
  [ProductLabel.DATA_ANALYTICS]: {
    isActive: true,
    isDisabled: false,
    isTitle: true,
  },
  [ProductLabel.AUDIO_SPEECH]: {
    isActive: true,
    isDisabled: false,
    isTitle: true,
  },
};
