export interface Company {
  cvList: boolean;
  _id: string;
  name: string;
  address: string;
  description: string;
  logo: string;
  createdBy: CreatedBy;
  isDeleted: boolean;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
  scale: string;
}

export interface CreatedBy {
  _id: string;
  email: string;
}
