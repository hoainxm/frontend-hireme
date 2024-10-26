export interface Job {
  _id: string;
  name: string;
  skills: string[];
  company: Company;
  location: string;
  salary: number;
  quantity: number;
  level: string;
  experience: string;
  description: string;
  gender: string;
  workForm: string[];
  appliedCandidates: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Company {
  _id: string;
  name: string;
  logo: string;
  scale: string;
}
