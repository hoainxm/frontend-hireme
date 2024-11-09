export interface Resume {
  _id: string;
  email: string;
  userId: string;
  url: string;
  status: string;
  companyId: CompanyId;
  jobId: JobId;
  history: History[];
  createdBy: CreatedBy;
  isDeleted: boolean;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
  updatedBy?: UpdatedBy2;
}

export interface CompanyId {
  _id: string;
  name: string;
}

export interface JobId {
  _id: string;
  name: string;
}

export interface History {
  status: string;
  updatedAt: string;
  updatedBy: UpdatedBy;
}

export interface UpdatedBy {
  _id: string;
  email: string;
}

export interface CreatedBy {
  _id: string;
  email: string;
}

export interface UpdatedBy2 {
  _id: string;
  email: string;
}
