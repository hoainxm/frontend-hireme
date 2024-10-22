import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Job } from '../model';
import { useTranslation } from 'react-i18next';
import { fetchJobById } from '../api';
import MainLayout from '@layout/main-layout';
import { PageName } from '@models/enum';
import styles from '../jobs.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ClockCircleOutlined, HistoryOutlined, MenuOutlined, MoneyCollectOutlined } from '@ant-design/icons';
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

  const isJobExpired = (endDate: string): boolean => {
    return dayjs(endDate).isBefore(dayjs());
  };

  if (loading) {
    return <div className={styles.loading}>{t('loading')}</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!job) {
    return <div className={styles.noData}>{t('noData')}</div>;
  }

  return (
    <MainLayout active={PageName.JOBS}>
      <div className={styles.pageContainer}>
        <div className={styles.leftColumn}>
          <div className={styles.section}>
            <div className={styles.name}>{job.name}</div>

            <div className={styles.head}>
              <MenuOutlined />
              {job.skills && job.skills.length > 0 && job.skills.map((item) => <p className={styles.borderSkills}>{item}</p>)}
            </div>
            <div className={styles.head}>
              <MoneyCollectOutlined />
              <p>{job.salary.toLocaleString()}</p>
            </div>
            <div className={styles.head}>
              <HistoryOutlined />
              <p>{dayjs(job.updatedAt).fromNow()}</p>
            </div>
            <div className={`${styles.head} ${styles.deadline}`}>
              <ClockCircleOutlined />
              <p>
                {t('timeApplicationJob')} : {dayjs(job.endDate).format('DD/MM/YYYY')}
              </p>
            </div>
          </div>
          <hr style={{ borderTop: '2px solid #ccc' }} />

          <button className={styles.applyBtn} disabled={isJobExpired(job.endDate)}>
            {t('jobDetail.applyNow')}
          </button>

          <div className={styles.section}>
            <div className={styles.longDescription}>
              <div className={styles.shortDescription} dangerouslySetInnerHTML={{ __html: job.description }} />
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <img
                src={`${process.env.REACT_APP_API_URL}/images/company/${job.company.logo}`}
                alt={`${job.company.name} logo`}
                className={styles.logo}
              />
            </div>
            <div className={styles.sectionTitle}>{t('jobDetail.companyInfo')}</div>
            <div className={styles.infoItem}>
              <div className={styles.label}>{t('jobDetail.companyName')}:</div>
              <div className={styles.value}>{job.company.name}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.label}>{t('jobDetail.companySize')}:</div>
              <div className={styles.value}>{job.company.size}</div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.label}>{t('jobDetail.companyAddress')}:</div>
              <div className={styles.value}>{job.location}</div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>{t('jobDetail.commonInfo')}</div>
            <div className={styles.infoItem}>
              <div className={styles.label}>{t('jobDetail.experience')}:</div>
              <div className={styles.value}>{job.level}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.label}>{t('jobDetail.quantity')}:</div>
              <div className={styles.value}>{job.quantity} người</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.label}>{t('jobDetail.jobTitle')}:</div>
              <div className={styles.value}>{job.salary.toLocaleString()} VND</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.label}>{t('jobDetail.employmentType')}:</div>
              <div className={styles.value}>{job.employmentType}</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobDetail;
