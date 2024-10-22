import React, { FC, HTMLAttributes, useEffect, useState, useTransition } from 'react';
import MainLayout from '../../common/ui/layout/main-layout';
import { PageName, SectionID } from '../../models/enum';
import { useDispatch } from 'react-redux';
import { updateSectionDot } from '@layout/slice';
import { BackToTop } from '@base/button/BackToTop';
import { useTranslation } from 'react-i18next';
import style from './jobs.module.scss';
import JobFilter from './components/JobFilter';
import JobList from './components/JobList';
import { PartnerSection } from '../../app/home/PartnerSection';
import { UpdateSection } from '../../app/home/UpdateSection';
import { Job } from '../jobs/model';
import { getAllJobs } from './api';
import JobSaved from './components/JobSaved';


interface Props extends HTMLAttributes<HTMLDivElement> {
  sectionId: string;
  currentPage: number;
}

export const Jobs: FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { sectionId } = props;
  const { t } = useTranslation();

  const scrollToTop = () => {
    dispatch(updateSectionDot(SectionID.HOME_BANNER));
  };

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  const fetchAllJobs = async () => {
    try {
      const result = await getAllJobs();
      console.log('result get all jobs', result);
      setJobs(result.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  console.log('check jobs: ', jobs);

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
      <JobSaved />
      <BackToTop resetScrollNavigation={scrollToTop} />
      <PartnerSection sectionId={sectionId} />
      <UpdateSection sectionId={sectionId} />
    </MainLayout>
  );
};

export default Jobs;
