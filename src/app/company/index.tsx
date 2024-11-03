import React, { FC, HTMLAttributes, useEffect, useState } from 'react';
import MainLayout from '../../common/ui/layout/main-layout';
import { PageName, SectionID } from '../../models/enum';
import { useDispatch } from 'react-redux';
import style from './company.module.scss';
import { useTranslation } from 'react-i18next';
import CompanyList from './components/CompanyList';
import { PartnerSection } from '../../app/home/PartnerSection';
import { UpdateSection } from '../../app/home/UpdateSection';
import { Company as CompanyType } from './model';
import { getAllCompanies } from './api';

interface Props extends HTMLAttributes<HTMLDivElement> {
  sectionId: string;
}

export const Companies: FC<Props> = ({ sectionId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyType[]>([]);

  const fetchAllCompanies = async () => {
    try {
      const result = await getAllCompanies(1, 10);
      setCompanies(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllCompanies();
  }, []);

  return (
    <MainLayout active={PageName.COMPANY}>
      <section id={sectionId} className={style.bannerSection}>
        <div className={style.bannerContainer}>
          <div className={style.top}>
            <h1 className={style.topTitle}>
              {t('companyList')}
              <h5>{t('companyList.title')}</h5>
            </h1>
          </div>
        </div>
      </section>
      <CompanyList />
      <PartnerSection sectionId={sectionId} />
      <UpdateSection sectionId={sectionId} />
    </MainLayout>
  );
};

export default Companies;
