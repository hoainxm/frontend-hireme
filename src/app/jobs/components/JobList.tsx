import React, { useState, useEffect } from 'react';
import style from '../jobs.module.scss';
import { useTranslation } from 'react-i18next';
import { Job as JobType } from '../../jobs/model';
import Job from '../components/Job';
import JobFilter from './JobFilter';
import { BackToTop } from '@base/button/BackToTop';
import dayjs from 'dayjs';
import { Button } from 'antd';

interface JobListProps {
  listJobs?: JobType[];
  isSavedJobs?: boolean;
}

const JobList: React.FC<JobListProps> = ({ listJobs = [], isSavedJobs = false }) => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const [filters, setFilters] = useState({
    position: '',
    experience: '',
    skills: [] as string[],
    province: '',
  });

  const [filteredJobs, setFilteredJobs] = useState<JobType[]>([]);
  const [currentJobs, setCurrentJobs] = useState<JobType[]>([]);
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');

  const isJobExpired = (endDate: string): boolean => {
    return dayjs(endDate).isBefore(dayjs());
  };

  const getRemainingDays = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const timeDiff = end.getTime() - now.getTime();
    return Math.max(Math.ceil(timeDiff / (1000 * 3600 * 24)), 0);
  };

  const applyFilters = (jobList: JobType[]) => {
    const { position, experience, skills, province } = filters;

    let filtered = jobList.filter((job) => {
      if (isJobExpired(job.endDate)) return false;
      const matchesPosition = position ? job.name.toLowerCase().includes(position.toLowerCase()) : true;
      const matchesExperience = experience ? job.level.toLowerCase() === experience.toLowerCase() : true;
      const matchesSkills = skills.length ? skills.every((skill) => job.skills.includes(skill.toLowerCase())) : true;
      const matchesProvince = province ? job.location.toLowerCase().includes(province.toLowerCase()) : true;

      return matchesPosition && matchesExperience && matchesSkills && matchesProvince;
    });

    if (sortOrder === 'recent') {
      filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOrder === 'oldest') {
      filtered = filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return filtered;
  };

  useEffect(() => {
    setFilteredJobs(applyFilters(listJobs));
    setCurrentPage(1);
  }, [filters, listJobs, sortOrder]);

  useEffect(() => {
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    setCurrentJobs(filteredJobs.slice(indexOfFirstJob, indexOfLastJob));
  }, [filteredJobs, currentPage]);

  const handleSortToggle = () => {
    setSortOrder((prevOrder) => (prevOrder === 'recent' ? 'oldest' : 'recent'));
  };

  const totalJobs = filteredJobs.length;
  const totalPages = Math.max(Math.ceil(totalJobs / jobsPerPage), 1);

  return (
    <div className={style.jobListContainer}>
      <div className={style.filterContainer}>
        <JobFilter onFilter={(newFilters) => setFilters(newFilters)} />
      </div>

      {listJobs.length === 0 ? (
        <div className={style.noResults}>{t('no.jobs.available')}</div>
      ) : (
        <div>
          {filteredJobs.length > 0 ? (
            <>
              <div className={style.jobList}>
                <div className={style.jobCount}>
                  {t('Found')} {totalJobs} {t('job.match')}
                  <Button type='primary' onClick={handleSortToggle}>
                    {sortOrder === 'recent' ? t('sort.by.oldest') : t('sort.by.recent')}
                  </Button>
                </div>
                {currentJobs.map((job) => (
                  <Job key={job._id} job={job} isJobExpired={isJobExpired} getRemainingDays={getRemainingDays} />
                ))}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>{t('no.matching.jobs')}</div>
          )}
        </div>
      )}

      {filteredJobs.length > 0 && (
        <div className={style.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`${style.pageButton} ${currentPage === index + 1 ? style.active : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      <BackToTop />
    </div>
  );
};

export default JobList;
