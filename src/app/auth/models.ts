/** @format */

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  address: string;
  gender: string;
  phone: string;
  dateOfBirth: string;
  isVerify: string;
  isPremium: string;
  role: Role;
  permissions: Permission[];
  avatar?: string;
  skills: string[];
}

export interface Role {
  _id: string;
  name: string;
}

export interface Permission {
  _id: string;
  name: string;
  apiPath: string;
  method: string;
  module: string;
}
