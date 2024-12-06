export interface Permission {
  _id: string;
  name: string;
  apiPath: string;
  method: string;
  module: string;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: any;
  createdBy: CreatedBy;
  updatedAt: string;
  __v: number;
}

export interface CreatedBy {
  _id: string;
  email: string;
}
