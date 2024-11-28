import React, { useEffect, useState } from 'react';
import style from './followCompany.module.scss';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

interface Company {
  _id: string;
  name: string;
  logo: string;
  address: string;
}

const FollowedCompanyList: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [followedCompanies, setFollowedCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const followedCompaniesFromStorage = JSON.parse(localStorage.getItem('followedCompanies') || '[]');
    const validCompanies = followedCompaniesFromStorage.filter((company: Company) => company && company._id); // Filter valid entries
    setFollowedCompanies(validCompanies);
  }, []);

  const handleCompanyClick = (companyId: string) => {
    history.push(`/companies/${companyId}`);
  };

  const removeFollowedCompany = (companyId: string) => {
    const updatedFollowedCompanies = followedCompanies.filter((company) => company._id !== companyId);
    localStorage.setItem('followedCompanies', JSON.stringify(updatedFollowedCompanies));
    setFollowedCompanies(updatedFollowedCompanies);
  };

  if (followedCompanies.length === 0) {
    return (
      <div className={style['no-followed-companies']}>
        <h2 className={style['no-followed-companies__title']}>{t('noFollowedCompanies')}</h2>
        <p className={style['no-followed-companies__message']}>{t('browseCompaniesPage')}</p>
        <button className={style['no-followed-companies__button']} onClick={() => history.push('/companies')}>
          {t('browseCompanies')}
        </button>
      </div>
    );
  }

  return (
    <div className={style['followed-companies']}>
      <h2 className={style['followed-companies__title']}>{t('user.followedCompanies')}</h2>
      <ul className={style['followed-companies__list']}>
        {followedCompanies.map((company) => (
          <li key={company._id} className={style['followed-companies__item']}>
            <div className={style['followed-companies__info']} onClick={() => handleCompanyClick(company._id)}>
              <img src={company.logo} alt={company.name} className={style['followed-companies__logo']} />
              <div className={style['followed-companies__details']}>
                <h3 className={style['followed-companies__name']}>{company.name}</h3>
                <p className={style['followed-companies__address']}>{company.address}</p>
              </div>
            </div>
            <button className={style['followed-companies__remove']} onClick={() => removeFollowedCompany(company._id)}>
              {t('unfollow')}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowedCompanyList;
