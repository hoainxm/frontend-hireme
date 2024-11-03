import React from 'react';
import { useHistory } from 'react-router-dom';
import style from '../company.module.scss';
import { Company as CompanyType } from '../model';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';

interface CompanyProps {
  company: CompanyType;
}

export const Company: React.FC<CompanyProps> = ({ company }) => {
  const history = useHistory();
  const { t } = useTranslation();

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const handleCompanyClick = () => {
    history.push(`/companies/${company._id}`);
  };

  return (
    <div className={style.company} onClick={handleCompanyClick}>
      <div className={style.head}>
        {company.logo && (
          <img src={`${process.env.REACT_APP_API_URL}/images/company/${company.logo}`} alt={`${company.name} logo`} className={style.logo} />
        )}
        <div className={style.companyName}>
          <Tooltip title={company.name}>
            <span>{company.name}</span>
          </Tooltip>
        </div>
      </div>

      <div className={style.companyDetails}>
        <div className={style.companyInfo}>
          <div className={style.head}>
            <TeamOutlined />
            <p>
              {company.scale} {t('jobDetail.companyStaff')}
            </p>
          </div>
          <div className={style.head}>
            <EnvironmentOutlined />
            <p>{company.address}</p>
          </div>
        </div>
      </div>
      <div className={style.description}>
        <p>{stripHtml(company.description)}</p>
      </div>
    </div>
  );
};

export default Company;
