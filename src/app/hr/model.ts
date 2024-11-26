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

export enum ResumeStatus {
  PENDING = 'PENDING',
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
}

export const ResumeStatusMapping: Record<ResumeStatus, string> = {
  [ResumeStatus.PENDING]: 'PENDING',
  [ResumeStatus.ACCEPT]: 'ACCEPT',
  [ResumeStatus.REJECT]: 'REJECT',
};

export const ResumeStatusOptions = Object.keys(ResumeStatus).map((key) => ({
  value: ResumeStatus[key as ResumeStatus],
  label: ResumeStatusMapping[ResumeStatus[key as ResumeStatus]],
}));
