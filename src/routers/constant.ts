/** @format */

import AICloudFeatureManagement from '../app/admin/dashboard';
import AILicenseWriter from '../app/admin/dashboard/ai-api-key/writer/AILicenseWriter';
import AIPackageWriter from '../app/admin/dashboard/ai-package/AIPackageWriter';
import { ForgotPassword } from '../app/auth/forgotPassword';
import Home from '../app/home';
import { Inbody } from '../app/trial/ocr/in-body';
import Login from '../app/auth/login';
import { MedicalDevice } from '../app/trial/ocr/medical-device';
import { PageURL } from '../models/enum';
import { ProductOCR } from '../app/product/ocr';
import Register from '../app/auth/register';
import { ResetPassword } from '../app/auth/resetPassword';
import { RouteModel } from './models';
import Tenant from '../app/admin/tenant/management';
import WelcomeInformation from '../app/admin/welcome-info';
import { Prescription } from '../app/trial/ocr/prescription';
import { ProductLayout } from '@layout/product-layout';
import { LicenseManagement } from '../app/license';
import { DynamicTemplate } from '../app/trial/ocr/dynamic-template';
import { CreateDynamicTemplate } from '../app/trial/ocr/dynamic-template/CreateDynamicTemplate';
import { ShowDynamicResult } from '../app/trial/ocr/dynamic-template/ShowDynamicResult';
import { TextToSpeech } from '../app/audio-processing/tts';
import { UpdateDynamicTemplate } from '../app/trial/ocr/dynamic-template/UpdateDynamicTemplate';
import Jobs from '../app/jobs';
<<<<<<< HEAD
<<<<<<< HEAD
import { EmailVerify } from '../app/auth/email-verify';
import JobDetail from '../app/jobs/components/JobDetail';
=======
import { ResendVerifyEmail } from '../app/auth/resend-verify-email';
import { VerifyEmail } from '../app/auth/verify-email';
>>>>>>> a8489aa79bfdf2041cadbc8995a6f73e88516b9f
=======
import { ResendVerifyEmail } from '../app/auth/resend-verify-email';
import { VerifyEmail } from '../app/auth/verify-email';
>>>>>>> e7ce729 (push code verify email)
// import Category from '../app/jobs/Category';

export const APP_ROUTE: Array<RouteModel> = [
  { path: PageURL.OCR_MEDICAL_DEVICE, component: MedicalDevice },
  { path: PageURL.OCR_IN_BODY, component: Inbody },
  { path: PageURL.OCR_PRESCRIPTION, component: Prescription },
  { path: PageURL.OCR_DYNAMIC_TEMPLATE_CREATE, component: CreateDynamicTemplate },
  { path: PageURL.OCR_DYNAMIC_TEMPLATE_UPDATE, component: UpdateDynamicTemplate },
  { path: PageURL.OCR_DYNAMIC_TEMPLATE, component: DynamicTemplate },
  { path: PageURL.OCR_DYNAMIC_TEMPLATE_RESULT, component: ShowDynamicResult },
  { path: PageURL.TEXT_TO_SPEECH, component: TextToSpeech },
];

export const PUBLIC_ROUTE = [
  {
    path: PageURL.HOME,
    component: Home,
  },
  {
    path: PageURL.PRODUCT_OCR,
    component: ProductOCR,
  },
  {
    path: PageURL.LOGIN,
    component: Login,
  },
  {
    path: PageURL.ADMIN_LOGIN,
    component: Login,
  },
  {
    path: PageURL.REGISTER,
    component: Register,
  },
  {
    path: PageURL.FORGOT_PASSWORD,
    component: ForgotPassword,
  },
  {
    path: PageURL.RESET_PASSWORD,
    component: ResetPassword,
  },
  {
    path: PageURL.JOBS,
    component: Jobs,
  },
  {
    path: PageURL.RESEND_VERIFY_EMAIL,
    component: ResendVerifyEmail,
<<<<<<< HEAD
  },
  {
    path: PageURL.VERIFY_EMAIL,
    component: VerifyEmail,
  },
<<<<<<< HEAD
  // {
  //   path: PageURL.CATEGORY,
  //   component: Category,
  // },
  {
    path: PageURL.JOBDETAIL,
    component: JobDetail,
  },
=======
>>>>>>> a8489aa79bfdf2041cadbc8995a6f73e88516b9f
=======
  },
  {
    path: PageURL.VERIFY_EMAIL,
    component: VerifyEmail,
  },
>>>>>>> e7ce729 (push code verify email)
];

export const PRIVATE_ROUTE = [
  { path: PageURL.PRODUCT_OVERVIEW, component: ProductLayout },
  { path: PageURL.LICENSE_MANAGEMENT, component: LicenseManagement },
];

export const ADMIN_ROUTE = [
  { path: PageURL.ADMIN, component: AICloudFeatureManagement },
  { path: PageURL.ADMIN_WELCOME_INFORM, component: WelcomeInformation },
  { path: PageURL.ADMIN_TENANT, component: Tenant },
  {
    path: PageURL.ADMIN_AI_PACKAGE_WRITER,
    component: AIPackageWriter,
  },
  {
    path: PageURL.ADMIN_AI_API_KEY_WRITER,
    component: AILicenseWriter,
  },
  { path: PageURL.ADMIN_AI_PACKAGE_INFO, component: AIPackageWriter },
];
