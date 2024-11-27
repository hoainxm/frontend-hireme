import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Company } from '../model';
import { useTranslation } from 'react-i18next';
import { getInfoCompany, getJobsByCompany } from '../api';
import MainLayout from '@layout/main-layout';
import { PageName, PageURL } from '@models/enum';
import InfoCompany from './InfoCompany';
import JobList from '../../jobs/components/JobList';
import style from '../components/CompanyDetail.module.scss';
import { Breadcrumb } from 'antd';
import { RootState, useAppSelector } from '../../../store/store';
import RelatedJobs from '../../jobs/components/RelatedJobs';
import CompanyBanner from '@images/AuthBackground1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faUsers, faPlus } from '@fortawesome/free-solid-svg-icons';

interface RouteParams {
  companyId: string;
}

const CompanyDetail: React.FC = () => {
  const { companyId } = useParams<RouteParams>();
  const { t } = useTranslation();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const history = useHistory();
  const userLogin = useAppSelector((state: RootState) => state.user);

  const fetchCompanyDetail = async () => {
    try {
      const response = await getInfoCompany(companyId);
      if (response.statusCode === 200) {
        setCompany(response.data);
        fetchJobsByCompanyId(response.data._id);
      } else {
        setError('Failed to fetch company details.');
      }
    } catch (err) {
      setError('An error occurred while fetching company details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobsByCompanyId = async (companyId: string) => {
    try {
      const res = await getJobsByCompany(companyId);
      if (res.statusCode === 200) {
        setJobs(res.data);
      } else {
        console.error('Failed to fetch jobs by company:', res.data);
      }
    } catch (error) {
      console.error('Error fetching jobs by company:', error);
    }
  };

  useEffect(() => {
    fetchCompanyDetail();
  }, [companyId]);

  const redirectToHome = () => {
    history.push(PageURL.HOME);
  };

  const redirectToCompanies = () => {
    history.push(PageURL.COMPANY);
  };

  if (loading) {
    return <div className={style['company-detail__loading']}>{t('loading')}</div>;
  }

  if (error) {
    return <div className={style['company-detail__error']}>{error}</div>;
  }

  if (!company) {
    return <div className={style['company-detail__no-data']}>{t('noData')}</div>;
  }

  return (
    <MainLayout active={PageName.COMPANY}>
      <div style={{ background: '#f4f5f5' }}>
        <div className={style['company-detail__container']}>
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
                    <span className={style['breadcrumb']} onClick={redirectToCompanies}>
                      {t('user.company')}
                    </span>
                  ),
                },
                {
                  title: <span className={style['breadcrumb breadcrumb__company-name']}>{company.name}</span>,
                },
              ]}
            />
          </div>

          <div className={style['banner']}>
            <div className={style['cover-wrapper']}>
              <img draggable='false' src={CompanyBanner} width='100%' alt='' />
            </div>

            <div className={style['company-logo']}>
              <img src={`${process.env.REACT_APP_API_URL}/images/company/${company.logo}`} alt='' className={style['logo']} />
            </div>

            <div className={style['company-infoview']}>
              <div className={style['detail']}>
                <h4>{company.name}</h4>
                <div className={style['box-detail']}>
                  <div className={style['in-detail']}>
                    <FontAwesomeIcon icon={faUsers} />
                    {company.scale}
                    {t('jobDetail.companyStaff')}
                  </div>
                  <div className={style['in-detail']}>
                    <FontAwesomeIcon icon={faMap} />
                    {company.address}
                  </div>
                </div>
              </div>
              <div className={style['followBtn']}>
                <FontAwesomeIcon icon={faPlus} /> {t('follow.Btn')}
              </div>
            </div>
          </div>

          <div className={style['company-detail']}>
            <div className={style['company-detail__left-column']}>
              <div className={style['company-detail__description']}>
                <h4>{t('companyDetail.description')}</h4>
                <div dangerouslySetInnerHTML={{ __html: company.description }} />
              </div>
            </div>
            <div className={style['company-detail__right-column']}>
              <RelatedJobs idCompany={company._id} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CompanyDetail;
