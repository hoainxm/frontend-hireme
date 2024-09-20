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

export interface LoginFormInputs {
  username: string;
  email: string;
  password: string;
  tenant_alias: string;
}

export interface RegisterFormInputs {
  first_name: string;
  last_name: string;
  email: string;
  confirm_password: string;
  password: string;
}

export interface ForgotPasswordFormInputs {
  email: string;
}

export interface ResetPasswordFormInputs {
  token?: string
  new_password: string;
  confirm_password: string;
}
