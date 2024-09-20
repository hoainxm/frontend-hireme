import { AIFeature, DocumentType, DynamicStatusCode, InbodyStatusCode, MedicalDeviceStatusCode, PrescriptionStatusCode } from '@models/enum';
import { RectConfig } from 'konva/lib/shapes/Rect';

export interface Inbody {
  Information: {
    ID: {
      value: string | null;
      bbox: Array<Array<number>>;
      unit: string | null;
    };
    Height: {
      value: string | null;
      bbox: Array<Array<number>>;
      unit: string | null;
    };
    Age: {
      value: string | null;
      bbox: Array<Array<number>>;
      unit: string | null;
    };
    Gender: {
      value: string | null;
      bbox: Array<Array<number>>;
      unit: string | null;
    };
    'Test Date/Time': {
      value: string | null;
      bbox: Array<Array<number>>;
      unit: string | null;
    };
  };
  'Body Composition Analysis': {
    'Total Body Water': {
      value: string | null;
      range: string | null;
      bbox: Array<Array<number>>;
      unit: string | null;
    };
    Protein: {
      value: string | null;
      range: string | null;
      bbox: Array<Array<number>>;
      unit: string | null;
    };
    Mineral: {
      value: string | null;
      range: string | null;
      bbox: Array<Array<number>>;
      unit: string | null;
    };
    'Body Fat Mass ': {
      value: string | null;
      range: string | null;
      bbox: Array<Array<number>>;
      unit: string | null;
    };
    Weight: {
      value: string | null;
      range: string | null;
      bbox: Array<Array<number>>;
      unit: string | null;
    };
  };
  'Muscle-Fat Analysis': {
    Weight: {
      value: string | null;
      bbox: Array<Array<number>>;
      class: string | null;
      unit: string | null;
    };
    SMM: {
      value: string | null;
      bbox: Array<Array<number>>;
      class: string | null;
      unit: string | null;
    };
    'Body Fat Mass': {
      value: string | null;
      bbox: Array<Array<number>>;
      class: string | null;
      unit: string | null;
    };
  };
  'Obesity Analysis': {
    BMI: {
      value: string | null;
      bbox: Array<Array<number>>;
      class: string | null;
      unit: string | null;
    };
    PBF: {
      value: string | null;
      bbox: Array<Array<number>>;
      class: string | null;
      unit: string | null;
    };
  };
  'InBody Score': {
    'Total score': {
      value: string | null;
      bbox: Array<Array<number>>;
      unit: string | null;
    };
  };
  'Weight Control': {
    'Target Weight': {
      value: string | null;
      bbox: Array<Array<number>>;
      unit: string | null;
    };
    'Weight Control': {
      value: string | null;
      bbox: Array<Array<number>>;
      unit: string | null;
    };
    'Fat Control': {
      value: string | null;
      bbox: Array<Array<number>>;
      unit: string | null;
    };
    'Muscle Control': {
      value: string | null;
      bbox: Array<Array<number>>;
      unit: string | null;
    };
  };
  // [key: string]: any;
}

export interface Medicine {
  medicine_name: string;
  medicine_link: string;
  duration: {
    value: string | null;
    unit: string | null;
  };
  strength: {
    value: string | null;
    unit: string | null;
  };
  instruction: string | null;
  quantity: string | null;
  dosage: {
    morning: string | null;
    noon: string | null;
    evening: string | null;
    night: string | null;
    other: string | null;
  };
  route: string | null;
  form: string | null;
  medication_timing: string | null;
  [key: string]: any;
}

export interface Prescription {
  medicine: Array<Medicine>;
  date_create: string;
  follow_up_schedule: {
    date: string;
    time: string;
    note: string;
    [key: string]: string;
  };
  user_info: {
    name: string;
    age: string;
    gender: string;
  };
}

export interface MedicalDevice {
  SYS?: string;
  DIA?: string;
  Pulse?: string;
  BG?: string;
  Temperature?: string;
}

export interface AINoticeOCRMedicalDeviceResult {
  transaction_id: string;
  error_code: MedicalDeviceStatusCode;
  message: string;
  data: {
    status_code: MedicalDeviceStatusCode;
    message: string;
    align_document?: string;
    bounding_document?: string;
    result: MedicalDevice;
  };
}

export interface AINoticeOCRInbodyResult {
  transaction_id: string;
  error_code: InbodyStatusCode;
  message: string;
  image?: string;
  data: Inbody;
}

export interface AINoticeOCRPrescriptionResult {
  transaction_id: string;
  error_code: PrescriptionStatusCode;
  message: string;
  data: {
    image: string | null;
    result: Prescription;
  };
}

export interface AIDynamicTemplateResult {
  transaction_id: string;
  data: {
    status_code: DynamicStatusCode;
    message: string;
    align_document: string;
    bounding_document: string;
    template_name: string;
    result: Array<{
      name: string;
      value: string;
      points: [number, number, number, number];
      index: number;
    }>;
    action: 'recognize';
  };
  error_code: DynamicStatusCode;
  message: string;
}

export interface AIDisplayImageDynamicResult {
  transaction_id: string;
  message: string;
  error_code: DynamicStatusCode;
  data: {
    status_code: DynamicStatusCode;
    message: string;
    display_image: string;
    org_screen_size: [number, number];
    document_type: string;
    template_box: Array<{
      value: string;
      points: [number, number, number, number];
      index: number;
      name: [string];
    }>;
    action: string;
  };
}

export interface AITTSResult {
  transaction_id: string;
  data: {
    request_id: string;
    tenant_id: string;
    wav: string;
    ok: true;
    errors?: [
      {
        loc: [string];
        msg: string;
        type: string;
        ctx: {
          limit_value: number;
        };
      }
    ];
  };
}

export interface BaseAINoticeOCRResponse<ResultType> {
  message: string;
  error_code: number;
  result: ResultType;
}

export interface AINoticeOCRMedicalDevice extends BaseAINoticeOCRResponse<AINoticeOCRMedicalDeviceResult> {}

export interface AINoticeOCRInbody extends BaseAINoticeOCRResponse<AINoticeOCRInbodyResult> {}

export interface AINoticeOCRPrescription extends BaseAINoticeOCRResponse<AINoticeOCRPrescriptionResult> {}

export interface AINoticeDisplayDynamicImage extends BaseAINoticeOCRResponse<AIDisplayImageDynamicResult> {}

export interface AINoticeDynamicImage extends BaseAINoticeOCRResponse<AIDynamicTemplateResult> {}

export interface AINoticeTTS extends BaseAINoticeOCRResponse<AITTSResult> {}

export interface PreSignalAIResponse {
  pre_signed_url: string;
  transaction_id: string;
  tenant: string;
  feature: AIFeature;
  pre_signed_body: {
    bucket: string;
    key: string;
    policy: string;
    'x-amz-algorithm': string;
    'x-amz-credential': string;
    'x-amz-date': string;
    'x-amz-signature': string;
    [key: string]: string;
  };
}

export interface RemainTurn {
  total: number | null;
  remaining: number | null;
}

export interface CRectConfig extends RectConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DynamicTemplateForm {
  display_image: string;
  org_screen_size: [number, number];
  label_box: Array<{
    value: string;
    points: [number, number, number, number];
    index: number;
    name: [string];
  }>;
  un_label: Array<{
    value: string;
    points: [number, number, number, number];
    index: number;
    name: [string];
  }>;
  num_img: number;
  new_template_name: string;
}

export interface ITemplate extends Pick<DynamicTemplateForm, "label_box"> {
  id: number;
  img_size: [number, number];
  template_name: string;
  tenant_id: string;
  document_type: DocumentType;
  template_image: string;
  created_time: string;
  latest_time: string;
  created_status: 1 | 0; //newest 1 = true
  updated_status: 1 | 0; //latest 1 = true
}

export interface DynamicForm {
  name: string;
};