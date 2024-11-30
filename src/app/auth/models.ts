import { CompanyId } from './../profile/model';
/** @format */

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  address: string;
  gender: string;
  phone: string;
  dateOfBirth: string;
  isVerify: boolean;
  isPremium: string;
  role: Role;
  permissions: Permission[];
  avatar?: string;
  skills: string[];
  myCV: string[];
}

export interface Role {
  _id: string;
  name: string;
}

export interface UserProfileByAdmin {
  avatar: string;
  skills: any[];
  isVerify: boolean;
  isPremium: string;
  myCV: any[];
  _id: string;
  // companyId: string;
  name: string;
  email: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  address: string;
  role: string;
  isDeleted: boolean;
  deletedAt: any;
  __v: number;
  createdAt: string;
  updatedAt: string;
  refreshToken: string;
}

export interface Permission {
  _id: string;
  name: string;
  apiPath: string;
  method: string;
  module: string;
}
