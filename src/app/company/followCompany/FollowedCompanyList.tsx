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

  // Lấy danh sách công ty đã theo dõi từ localStorage
  useEffect(() => {
    const followedCompaniesFromStorage = JSON.parse(localStorage.getItem('followedCompanies') || '[]');
    setFollowedCompanies(followedCompaniesFromStorage);
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
      <ul className={style['followed-companies__list']}>
        {followedCompanies.map((company) => (
          <div key={company._id} className={style['followed-companies__item']}>
            <div className={style['followed-companies__info']} onClick={() => handleCompanyClick(company._id)}>
              {/* <img src={company.logo} alt={company.name} className={style['followed-companies__logo']} /> */}
              <div className={style['followed-companies__details']}>
                <h3 className={style['followed-companies__name']}>{company.name}</h3>
                <p className={style['followed-companies__address']}>{company.address}</p>
              </div>
            </div>
            <button className={style['followed-companies__remove']} onClick={() => removeFollowedCompany(company._id)}>
              {t('unfollow')}
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default FollowedCompanyList;
