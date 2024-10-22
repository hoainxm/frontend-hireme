// export interface Job {
//   _id: string;
//   name: string;
//   skills: string[];
//   company: { _id: string; name: string; logo: string };
//   location: string;
//   salary: number;
//   quantity: number;
//   level: string;
//   description: string;
//   startDate: string;
//   endDate: string;
//   isActive: boolean;
//   createdBy: {
//     _id: string;
//     email: string;
//   };
//   isDeleted: boolean;
//   deletedAt: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Province {
//   Id: string;
//   Name: string;
//   Districts: District[];
// }

// interface District {
//   Id: string;
//   Name: string;
//   Wards: Ward[];
// }

// interface Ward {
//   Id?: string;
//   Name?: string;
//   Level: string;
// }

export interface Job {
  _id: string;
  name: string;
  skills: string[];
  company: Company;
  location: string;
  salary: number;
  quantity: number;
  level: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdBy: CreatedBy;
  isDeleted: boolean;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
  updatedBy?: UpdatedBy;
  employmentType: string;
}

export interface Company {
  _id: string;
  name: string;
  logo: string;
  size: string;
}

export interface CreatedBy {
  _id: string;
  email: string;
}

export interface UpdatedBy {
  _id: string;
  email: string;
}
