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
<<<<<<< HEAD
  new_password: string;
  confirm_password: string;
=======
  newPassword: string;
  confirm_password?: string;
}

export interface EmailVerifyFormInputs {
  email: string;
>>>>>>> f0fc39b340ad0631ec04694330f68e18cf28c5ee
}
