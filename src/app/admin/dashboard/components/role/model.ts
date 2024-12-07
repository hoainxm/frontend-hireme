export interface Role {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  permissions: string[];
  isDeleted: boolean;
  deletedAt: any;
  __v: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: UpdatedBy;
  createdBy?: CreatedBy;
}

export interface UpdatedBy {
  _id: string;
  email: string;
}

export interface CreatedBy {
  _id: string;
  email: string;
}
