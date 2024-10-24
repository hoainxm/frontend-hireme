import React, { FC, HTMLAttributes, useEffect, useState, useTransition } from 'react';
import MainLayout from '../../../common/ui/layout/main-layout';
import { PageName, SectionID } from '../../../models/enum';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import style from '../jobs.module.scss';
import { PartnerSection } from '../../../app/home/PartnerSection';
import { UpdateSection } from '../../../app/home/UpdateSection';
import JobSaved from '../savedJobs/JobSaved';

interface Props extends HTMLAttributes<HTMLDivElement> {
  sectionId: string;
  currentPage: number;
}

export const SavedJobs: FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { sectionId } = props;
  const { t } = useTranslation();

  return (
    <MainLayout active={PageName.SAVE_JOBS}>
      <div className={style.bannerSection}>
        <div className={style.bannerContainer}>
          <div className={style.top}>
            <h1 className={style.topTitle}>
              {t('user.savedJobs')}
              <h5>{t('savedJobs.title')}</h5>
            </h1>
          </div>
        </div>
      </div>
      <JobSaved />
      <PartnerSection sectionId={sectionId} />
      <UpdateSection sectionId={sectionId} />
    </MainLayout>
  );
};

export default SavedJobs;
