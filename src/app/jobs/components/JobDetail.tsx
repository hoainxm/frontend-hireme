import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Job } from '../model';
import { useTranslation } from 'react-i18next';
import { fetchJobById, fetchJobBySkill } from '../api';
import MainLayout from '@layout/main-layout';
import { PageName, PageURL } from '@models/enum';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import InfoCompany from '../../company/components/InfoCompany';
import JobCard from './JobCard';
import GeneralInfo from './GeneralInfo';
import style from './JobDetail.module.scss';
import { Breadcrumb } from 'antd';
import RelatedJobs from './RelatedJobs';

dayjs.extend(relativeTime);

interface RouteParams {
  jobId: string;
}

const JobDetail: React.FC = () => {
  const { jobId } = useParams<RouteParams>();
  const { t } = useTranslation();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [idCompany, setIdCompany] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([]);
  const [jobBySkills, setJobBySkills] = useState<Job[] | null>(null);

  const history = useHistory();

  const fetchJobDetail = async () => {
    try {
      const response = await fetchJobById(jobId);
      if (response.data.statusCode === 200) {
        setJob(response.data.data);
        setIdCompany(response.data.data.company._id);
        setSkills(response.data.data.skills);
        fetchJobSkills(response.data.data.skills);
      } else {
        setError(response.data.message || 'Failed to fetch job details.');
      }
    } catch (err) {
      setError('An error occurred while fetching job details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobSkills = async (skills: string[]) => {
    if (skills && skills.length > 0) {
      try {
        const res = await fetchJobBySkill(skills);
        if (res.data.statusCode === 201) {
          setJobBySkills(res.data.data);
          console.log('Jobs by skills: ', res.data.data);
        } else {
          console.error('Failed to fetch job by skills:', res.data.message);
        }
      } catch (error) {
        console.error('Error fetching job by skills:', error);
      }
    } else {
      console.log('No skills available for this job');
    }
  };

  useEffect(() => {
    fetchJobDetail();
  }, [jobId]);

  const redirectToHome = () => {
    history.push(PageURL.HOME);
  };

  const redirectToJob = () => {
    history.push(PageURL.JOBS);
  };

  if (loading) {
    return <div className={style['job-detail__loading']}>{t('loading')}</div>;
  }

  if (error) {
    return <div className={style['job-detail__error']}>{error}</div>;
  }

  if (!job) {
    return <div className={style['job-detail__no-data']}>{t('noData')}</div>;
  }

  return (
    <MainLayout active={PageName.JOBS}>
      <div style={{ background: '#f4f5f5' }}>
        <div className={style['job-detail__container']}>
          <div className={style['breadcrumb-wrapper']}>
            <Breadcrumb
              separator={<span className={style['breadcrumb-separator']}>{'->'}</span>}
              items={[
                {
                  title: (
                    <span className={style['breadcrumb']} onClick={redirectToHome}>
                      {t('user.home')}
                    </span>
                  ),
                },
                {
                  title: (
                    <span className={style['breadcrumb']} onClick={redirectToJob}>
                      {t('user.jobs')}
                    </span>
                  ),
                },
                {
                  title: <span className={style['breadcrumb breadcrumb__job-name']}>{job.name}</span>,
                },
              ]}
            />
          </div>
          <div className={style['job-detail']}>
            <div className={style['job-detail__left-column']}>
              <JobCard job={job} />
              <RelatedJobs skills={skills} />
            </div>
            <div className={style['job-detail__right-column']}>
              <div className={style['job-detail__company-info']}>
                <InfoCompany idCompany={idCompany} />
              </div>
              <div className={style['job-detail__general-info']}>
                <GeneralInfo job={job} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobDetail;
