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
import { mockJobs } from './jobData';

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

  const [jobs, setJobs] = useState<Job[]>([]); // Assuming you fetch this from an API
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

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
            <h1 className={style.topTitle}>{t('joblist')}</h1>
          </div>
        </div>
      </section>
      <JobFilter onFilter={handleFilter} />
      {/* <JobList jobs={filteredJobs.length > 0 ? filteredJobs : jobs} /> */}
      <JobList jobs={mockJobs} />
      <BackToTop resetScrollNavigation={scrollToTop} />
    </MainLayout>
  );
};

export default Jobs;
