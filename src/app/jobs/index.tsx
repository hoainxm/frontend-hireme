import React, { FC, HTMLAttributes, useEffect, useState } from 'react';
import MainLayout from '../../common/ui/layout/main-layout';
import { PageName, SectionID } from '../../models/enum';
import { useDispatch } from 'react-redux';
import style from './jobs.module.scss';
import { useTranslation } from 'react-i18next';
import JobFilter from './components/JobFilter';
import JobList from './components/JobList';
import { PartnerSection } from '../../app/home/PartnerSection';
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
      const activeJobs = result.data.filter((job: JobType) => job.isActive);
      setJobs(activeJobs);
      setFilteredJobs(activeJobs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const handleFilter = (filters: any) => {
    let filtered = jobs;

    if (filters.position) {
      filtered = filtered.filter((job) => job.name.includes(filters.position));
    }

    if (filters.experience) {
      filtered = filtered.filter((job) => job.experience === filters.experience);
    }

    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter((job) => filters.skills.some((skill: string) => job.skills.includes(skill)));
    }

    if (filters.province) {
      filtered = filtered.filter((job) => job.location === filters.province);
    }

    setFilteredJobs(filtered.length > 0 ? filtered : []);
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
      {/* <JobFilter onFilter={handleFilter} /> */}
      <JobList listJobs={filteredJobs.length > 0 ? filteredJobs : jobs} />
      <PartnerSection sectionId={sectionId} />
    </MainLayout>
  );
};

export default Jobs;
