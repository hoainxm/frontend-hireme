import React, { FC, HTMLAttributes } from 'react';
import MainLayout from '../../../common/ui/layout/main-layout';
import { PageName, SectionID } from '../../../models/enum';
import { useTranslation } from 'react-i18next';
import style from './followCompany.module.scss';
import { PartnerSection } from '../../../app/home/PartnerSection';
import FollowedCompanyList from './FollowedCompanyList';

interface Props extends HTMLAttributes<HTMLDivElement> {
  sectionId: string;
  currentPage: number;
}

export const FollowedCompanies: FC<Props> = (props) => {
  const { sectionId } = props;
  const { t } = useTranslation();

  return (
    <MainLayout active={PageName.FOLLOWED_COMPANIES}>
      <div className={style.bannerSection}>
        <div className={style.bannerContainer}>
          <div className={style.top}>
            <h1 className={style.topTitle}>
              {t('user.followedCompanies')}
              <h5>{t('followedCompanies.title')}</h5>
            </h1>
          </div>
        </div>
      </div>
      <FollowedCompanyList />
      <PartnerSection sectionId={sectionId} />
    </MainLayout>
  );
};

export default FollowedCompanies;
