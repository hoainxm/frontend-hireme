import { User } from 'app/auth/forms';
import { Company, Job } from 'app/jobs/model';

export interface History {
  status: 'PENDING' | 'REVIEW' | 'APPROVED' | 'REJECTED';
  updatedAt: string;
  updatedBy: User;
}

export interface Resume {
  _id: string;
  email: string;
  userId: string;
  url: string;
  status: 'PENDING' | 'REVIEW' | 'APPROVED' | 'REJECTED';
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
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export const ResumeStatusMapping: Record<ResumeStatus, string> = {
  [ResumeStatus.PENDING]: 'PENDING',
  [ResumeStatus.REVIEW]: 'REVIEW',
  [ResumeStatus.APPROVED]: 'APPROVED',
  [ResumeStatus.REJECTED]: 'REJECTED',
};

export const ResumeStatusOptions = Object.keys(ResumeStatus).map((key) => ({
  value: ResumeStatus[key as ResumeStatus],
  label: ResumeStatusMapping[ResumeStatus[key as ResumeStatus]],
}));

