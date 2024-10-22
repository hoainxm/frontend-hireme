import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Job } from '../model';
import { useTranslation } from 'react-i18next';
import { fetchJobById } from '../api';
import MainLayout from '@layout/main-layout';
import { PageName } from '@models/enum';
import style from '../jobs.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FieldTimeOutlined, MenuOutlined, MoneyCollectOutlined } from '@ant-design/icons';
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

  const fetchJobDetail = async () => {
    try {
      const response = await fetchJobById(jobId);
      if (response.data.statusCode === 200) {
        setJob(response.data.data);
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

  useEffect(() => {
    fetchJobDetail();
  }, [jobId]);

  console.log(job);

  const getRemainingDays = (endDate: string): number => {
    const end = new Date(endDate);
    const now = new Date();
    const timeDiff = end.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysRemaining > 0 ? daysRemaining : 0;
  };

  if (loading) {
    return <div className={style.loading}>{t('loading')}</div>;
  }

  if (error) {
    return <div className={style.error}>{error}</div>;
  }

  if (!job) {
    return <div className={style.noData}>{t('noData')}</div>;
  }
  console.log();
  return (
    <MainLayout active={PageName.JOBS}>
      <div className={style.pageContainer}>
        <div className={style.leftColumn}>
          <div className={style.section}>
            <div className={style.name}>{job.name}</div>

            <div className={style.head}>
              <MenuOutlined />
              {job.skills && job.skills.length > 0 && job.skills.map((item) => <p className={style.borderSkills}>{item}</p>)}
            </div>
            <div className={style.head}>
              <MoneyCollectOutlined />
              <p>{job.salary.toLocaleString()}</p>
            </div>
            <div className={style.head}>
              <FieldTimeOutlined />
              <p>{dayjs(job.updatedAt).fromNow()}</p>
            </div>
          </div>
          <hr style={{ borderTop: '2px solid #ccc' }} />
          <div className={style.applyBtn}>{t('jobDetail.applyNow')}</div>
          <div className={style.section}>
            <div className={style.longDescription}>
              <div className={style.shortDescription} dangerouslySetInnerHTML={{ __html: job.description }} />
            </div>
          </div>
        </div>

        <div className={style.rightColumn}>
          <div className={style.section}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <img
                src={`${process.env.REACT_APP_API_URL}/images/company/${job.company.logo}`}
                alt={`${job.company.name} logo`}
                className={style.logo}
              />
            </div>
            <div className={style.sectionTitle}>{t('jobDetail.companyInfo')}</div>
            <div className={style.infoItem}>
              <div className={style.label}>{t('jobDetail.companyName')}:</div>
              <div className={style.value}>{job.company.name}</div>
            </div>
            <div className={style.infoItem}>
              <div className={style.label}>{t('jobDetail.companySize')}:</div>
              <div className={style.value}>{job.company.size}</div>
            </div>

            <div className={style.infoItem}>
              <div className={style.label}>{t('jobDetail.companyAddress')}:</div>
              <div className={style.value}>{job.location}</div>
            </div>
          </div>

          <div className={style.section}>
            <div className={style.sectionTitle}>{t('jobDetail.commonInfo')}</div>
            <div className={style.infoItem}>
              <div className={style.label}>{t('jobDetail.experience')}:</div>
              <div className={style.value}>{job.level}</div>
            </div>
            <div className={style.infoItem}>
              <div className={style.label}>{t('jobDetail.quantity')}:</div>
              <div className={style.value}>{job.quantity} người</div>
            </div>
            <div className={style.infoItem}>
              <div className={style.label}>{t('jobDetail.jobTitle')}:</div>
              <div className={style.value}>{job.salary.toLocaleString()} VND</div>
            </div>
            <div className={style.infoItem}>
              <div className={style.label}>{t('jobDetail.employmentType')}:</div>
              <div className={style.value}>{job.employmentType}</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobDetail;
