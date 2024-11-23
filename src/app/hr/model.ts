import { User } from 'app/auth/forms';
import { Company, Job } from 'app/jobs/model';

export interface History {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  updatedAt: string;
  updatedBy: User;
}

export interface Resume {
  _id: string;
  email: string;
  userId: string;
  url: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  companyId: Company;
  jobId: Job;
  history: History[];
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}
