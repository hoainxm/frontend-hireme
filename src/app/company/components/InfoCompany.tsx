import React, { useEffect, useState } from 'react';
import { Company } from '../model';
import { Link, useHistory } from 'react-router-dom';
import { getInfoCompany } from '../api';
import style from './InfoCompany.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faMapMarkerAlt, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { PageURL } from '@models/enum';

interface InfoCompanyProps {
  idCompany: string;
}

const InfoCompany: React.FC<InfoCompanyProps> = ({ idCompany }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [infoCompany, setInfoCompany] = useState<Company | null>(null);

  const getInfo = async () => {
    try {
      const res = await getInfoCompany(idCompany);
      setInfoCompany(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getInfo();
  }, [idCompany]);

  if (!infoCompany) {
    return <p>Loading...</p>;
  }

  return (
    <div className={style['info-company']}>
      <div className={style['info-company__header']}>
        <div className={style['info-company__header-logo-container']}>
          <img
            src={`${process.env.REACT_APP_API_URL}/images/company/${infoCompany.logo}`}
            alt={infoCompany.name}
            className={style['info-company__header-logo-container-logo']}
          />
        </div>
        <h4 className={style['info-company__header-name']}>{infoCompany.name}</h4>
      </div>
      <div className={style['info-company__info-container']}>
        <div className={style['info-company__info-container-item']}>
          <div>
            <FontAwesomeIcon icon={faUsers} className={style['info-company__info-container-item-icon']} />
            <span className={style['info-company__info-container-item-title']}>{t('jobDetail.companyScale')}:</span>
          </div>
          <span className={style['info-company__info-container-item-value']}>
            {infoCompany.scale}
            {'+'} {t('jobDetail.companyStaff')}
          </span>
        </div>
        <div className={style['info-company__info-container-item']}>
          <div>
            <FontAwesomeIcon icon={faMapMarkerAlt} className={style['info-company__info-container-item-icon']} />
            <span className={style['info-company__info-container-item-title']}>{t('jobDetail.companyAddress')}:</span>
          </div>
          <span className={style['info-company__info-container-item-value']}>{infoCompany.address}</span>
        </div>
        <a href='#!' className={style['info-company__link']} target='_blank' rel='noopener noreferrer'>
          {t('jobDetail.goToCompanyPage')} <FontAwesomeIcon icon={faExternalLinkAlt} className='link-icon' />
        </a>
      </div>
    </div>
  );
};

export default InfoCompany;
