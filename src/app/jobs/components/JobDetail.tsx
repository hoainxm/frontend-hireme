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
import { ClockCircleOutlined, HeartOutlined, HistoryOutlined, MenuOutlined, MoneyCollectOutlined } from '@ant-design/icons';
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

  console.log(job);
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
    return <div className={style.loading}>{t('loading')}</div>;
  }

  if (error) {
    return <div className={style.error}>{error}</div>;
  }

  if (!job) {
    return <div className={style.noData}>{t('noData')}</div>;
  }

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
              <HistoryOutlined />
              <p>{dayjs(job.updatedAt).fromNow()}</p>
            </div>
            <div className={`${style.head} ${style.deadline}`}>
              <ClockCircleOutlined />
              <p>
                {t('timeApplicationJob')} : {dayjs(job.endDate).format('DD/MM/YYYY')}
              </p>
            </div>
          </div>
          <hr style={{ borderTop: '2px solid #ccc' }} />

          <div className={style.groupBtnActJobDetail}>
            <button className={style.applyBtn} disabled={isJobExpired(job.endDate)}>
              {t('jobDetail.applyNow')}
            </button>
            <button className={`${style.btn} ${style.btnHeart} `} disabled={isJobExpired(job.endDate)}>
              <HeartOutlined />
            </button>
          </div>

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
              <div className={style.label}>{t('jobDetail.companyScale')}:</div>
              <div className={style.value}>{job.company.scale} nhân viên</div>
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
              <div className={style.value}>{job.workForm.join(', ')}</div>
            </div>

            <div className={style.infoItem}>
              <div className={style.label}>{t('jobDetail.gender')}:</div>
              <div className={style.value}>{job.gender === '' ? <span>Không bắt buộc</span> : job.gender}</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobDetail;
