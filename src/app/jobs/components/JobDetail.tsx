import React, { useState, useEffect } from 'react';
import styles from '../jobs.module.scss';
import { useTranslation } from 'react-i18next';

interface Company {
  _id: string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  address: string;
}

interface Job {
  name: string;
  skills: string[];
  company: Company;
  location: string;
  salary: number;
  quantity: number;
  level: string;
  experience: string;
  employmentType: string;
  genderRequirement: string;
  description: string;
  jobRequirement: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface JobDetailProps {
  job: Job;
}

const JobDetail: React.FC<JobDetailProps> = ({ job }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={styles.pageContainer}>
      {/* Cột trái: Thông tin chi tiết công việc */}
      <div className={styles.leftColumn}>
        <div className={styles.section}>
          <div className={styles.name}>
            {job.name} - {t('jobDetail.jobTitle')} {job.salary.toLocaleString()} VND
          </div>
          <div className={styles.shortDescription}>{job.description}</div>
        </div>

        <div className={styles.section}>
          <div className={styles.name}>{t('jobDetail.descriptionTitle')}</div>
          <div className={styles.longDescription}>
            {job.jobRequirement && job.jobRequirement.length > 0 ? (
              job.jobRequirement.map((requirement, index) => (
                <div key={index} className={styles.requirementItem}>
                  {requirement}
                </div>
              ))
            ) : (
              <div>{t('jobDetail.noRequirements')}</div>
            )}
          </div>
        </div>

        <div className={styles.applyBtn}>{t('jobDetail.applyNow')}</div>
      </div>

      {/* Cột phải: Thông tin công ty và thông tin chung */}
      <div className={styles.rightColumn}>
        <div className={styles.section}>
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
            <div className={styles.label}>{t('jobDetail.companyIndustry')}:</div>
            <div className={styles.value}>{job.company.industry}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.label}>{t('jobDetail.companyAddress')}:</div>
            <div className={styles.value}>{job.company.address}</div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>{t('jobDetail.commonInfo')}</div>
          <div className={styles.infoItem}>
            <div className={styles.label}>{t('jobDetail.experience')}:</div>
            <div className={styles.value}>{job.experience}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.label}>{t('jobDetail.quantity')}:</div>
            <div className={styles.value}>{job.quantity} người</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.label}>{t('jobDetail.employmentType')}:</div>
            <div className={styles.value}>{job.employmentType}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.label}>{t('jobDetail.genderRequirement')}:</div>
            <div className={styles.value}>{job.genderRequirement}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
