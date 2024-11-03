import React, { FC, HTMLAttributes, useEffect, useState } from 'react';
import MainLayout from '../../common/ui/layout/main-layout';
import { PageName, SectionID } from '../../models/enum';
import { useDispatch } from 'react-redux';
import style from './jobs.module.scss';
import { useTranslation } from 'react-i18next';
import JobFilter from './components/JobFilter';
import JobList from './components/JobList';
import { PartnerSection } from '../../app/home/PartnerSection';
import { UpdateSection } from '../../app/home/UpdateSection';
import { Job as JobType } from '../jobs/model';
import { getAllJobs } from './api';

interface Props extends HTMLAttributes<HTMLDivElement> {
  sectionId: string;
}

export const Jobs: FC<Props> = ({ sectionId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [jobs, setJobs] = useState<JobType[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobType[]>([]);

  const fetchAllJobs = async () => {
    try {
      const result = await getAllJobs();
      setJobs(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const handleFilter = (filters: any) => {
    let filtered = jobs;

    if (filters.location) {
      filtered = filtered.filter((job) => job.location.includes(filters.location));
    }

    if (filters.level) {
      filtered = filtered.filter((job) => job.level === filters.level);
    }

    if (filters.minSalary) {
      filtered = filtered.filter((job) => job.salary >= filters.minSalary);
    }

    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter((job) => filters.skills.every((skill: string) => job.skills.includes(skill)));
    }

    setFilteredJobs(filtered);
  };

  return (
    <MainLayout active={PageName.JOBS}>
      <section id={sectionId} className={style.bannerSection}>
        <div className={style.bannerContainer}>
          <div className={style.top}>
            <h1 className={style.topTitle}>
              {t('joblist')}
              <h5>{t('joblist.title')}</h5>
            </h1>
          </div>
        </div>
      </section>
      <JobFilter onFilter={handleFilter} />
      <JobList listJobs={filteredJobs.length > 0 ? filteredJobs : jobs} />
      <PartnerSection sectionId={sectionId} />
      <UpdateSection sectionId={sectionId} />
    </MainLayout>
  );
};

export default Jobs;
