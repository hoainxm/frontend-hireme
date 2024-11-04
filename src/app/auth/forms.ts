/** @format */

export interface AuthWelcomeInfo {
  id?: number;
  primary_name: string;
  address: string;
  email: string;
  phone_detail: string;
  primary_logo: string;
  background: string;
  secondary_logo: string;
  zalo_logo?: string;
}

// export interface LoginFormInputs {
//   username: string;
//   email: string;
//   password: string;
//   tenant_alias: string;
// }

export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface IUserResponse {
  access_token: string;
  user: User;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  permissions: any[];
}

export interface Role {
  _id: string;
  name: string;
}

export interface RegisterFormInputs {
  name: string;
  email: string;
  confirm_password?: string;
  password: string;
  birthday: string;
  gender: string;
  address: string;
}

export interface ForgotPasswordFormInputs {
  email: string;
}

export interface ResetPasswordFormInputs {
  token?: string;
  newPassword: string;
  confirm_password?: string;
}

export interface EmailVerifyFormInputs {
  email: string;
}
