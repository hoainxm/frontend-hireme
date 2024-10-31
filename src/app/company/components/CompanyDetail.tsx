import React, { useEffect, useState } from 'react';
import MainLayout from '@layout/main-layout';
import { PageName } from '@models/enum';
import { useParams } from 'react-router-dom';
import { Company } from '../model';
import { Job } from '../../jobs/model';
import { getInfoCompany, getJobsByCompany } from '../api';
import InfoCompany from './InfoCompany';
import JobList from '../../jobs/components/JobList';
import style from './CompanyDetail.module.scss';

const CompanyDetail: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingCompany, setIsLoadingCompany] = useState<boolean>(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsLoadingCompany(true);
      try {
        const companyData = await getInfoCompany(companyId);
        setCompany(companyData.data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      } finally {
        setIsLoadingCompany(false);
      }
    };

    const fetchJobs = async () => {
      setIsLoadingJobs(true);
      try {
        const jobData = await getJobsByCompany(companyId);
        setJobs(jobData.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchCompanyData();
    fetchJobs();
  }, [companyId]);

  return (
    <MainLayout active={PageName.COMPANY}>
      <div className={style['company-detail']}>
        {isLoadingCompany ? (
          <p>Loading company details...</p>
        ) : company ? (
          <InfoCompany idCompany={companyId} />
        ) : (
          <p>Company details not available.</p>
        )}

        <div className={style['company-detail__jobs']}>
          <h2>Available Jobs</h2>
          {isLoadingJobs ? <p>Loading jobs...</p> : jobs.length > 0 ? <JobList listJobs={jobs} /> : <p>No jobs available for this company.</p>}
        </div>
      </div>
    </MainLayout>
  );
};

export default CompanyDetail;
