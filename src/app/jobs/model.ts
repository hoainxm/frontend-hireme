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
  workForm: string[];
  gender: string;
}

export interface Company {
  _id: Id;
  name: string;
  address: string;
  description: string;
  logo: string;
  createdBy: CreatedBy;
  isDeleted: boolean;
  deletedAt: any;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  __v: number;
  scale: string;
}

export interface Id {
  $oid: string;
}

export interface CreatedBy {
  _id: string;
  email: string;
}

export interface CreatedAt {
  $date: string;
}

export interface UpdatedAt {
  $date: string;
}

export interface UpdatedBy {
  _id: string;
  email: string;
}
