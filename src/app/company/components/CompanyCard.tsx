import React from 'react';
import { Company } from '../model';
import InfoCompany from './InfoCompany';
import style from '../company.module.scss';
import { useHistory } from 'react-router-dom';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const history = useHistory();
  const maxDescriptionLength = 150;
  const truncatedDescription =
    company.description.length > maxDescriptionLength ? company.description.substring(0, maxDescriptionLength) + '...' : company.description;

  const handleClick = () => {
    history.push(`/companies/${company._id}`);
  };

  return (
    <div className={style['company-card']} onClick={handleClick}>
      <InfoCompany idCompany={company._id} />
      <div className={style['company-card__extra']}>
        <div dangerouslySetInnerHTML={{ __html: company.description }} />
      </div>
    </div>
  );
};

export default CompanyCard;
