/** @format */

// export interface Tenant {
//   id: string;
//   name: string;
//   logo: string | null;
//   alias: string;
//   default_pool: string;
// }

export interface UserProfile {
  statusCode: number;
  message: string;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      avatar?: string;
      role: {
        _id: string;
        name: string;
      };
      permissions: Array<string>;
    };
  };
  // _id: string;
  // name: string;
  // email: string;
  // avatar?: string;
  // role: {
  //   _id: string;
  //   name: string;
  // };
  // permissions: Array<string>;
}

// export interface UserProfile {
//   avatar: string | null;
//   email: string;
//   first_name: string;
//   full_name: string;
//   _id: string;
//   is_superuser: boolean;
//   user_id: string;
//   last_name: string;
//   birthday: string;
//   gender: string;
//   address: string;
//   tenant_logo: string;
//   social_token: string;
//   username: string;
//   last_login: string;
//   default_pool: string;
//   is_blacklist: boolean;
//   tenant: string;
//   is_reset_password: string;
//   user_roles: Array<UserRole>;
// }

// export interface UserRole {
//   role: string;
//   department: string;
// }
