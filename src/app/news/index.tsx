import React, { FC, HTMLAttributes, useEffect, useState, useTransition } from 'react';
import MainLayout from '../../common/ui/layout/main-layout';
import { PageName, SectionID } from '../../models/enum';
import { useDispatch } from 'react-redux';
import { updateSectionDot } from '@layout/slice';
import { BackToTop } from '@base/button/BackToTop';
import { useTranslation } from 'react-i18next';
import style from './news.module.scss';

const categories = [
  { id: 1, label: 'Augmented Reality' },
  { id: 2, label: 'Reinforcement Learning' },
  { id: 3, label: 'Machine Learning' },
  { id: 4, label: 'Generative Adversarial Network' },
  { id: 5, label: 'Human-Computer Interface' },
  { id: 6, label: 'Big Data' },
  { id: 7, label: 'Cognitive Computing' },
  { id: 8, label: 'Computer Vision' },
  { id: 9, label: 'Patern Recognition' },
  { id: 10, label: 'Emergent Behavior' },
  { id: 11, label: 'Generative AI' },
  { id: 12, label: 'Large Language Model' },
  { id: 13, label: 'Natural Language Processing' },
  { id: 14, label: 'Prescriptive Analytics' },
  { id: 15, label: 'Structured Data' },
];

interface Props extends HTMLAttributes<HTMLDivElement> {
  sectionId: string;
}

export const News: FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { sectionId } = props;
  const { t } = useTranslation();

  const scrollToTop = () => {
    dispatch(updateSectionDot(SectionID.HOME_BANNER));
  };

  return (
    <MainLayout active={PageName.NEWS}>
      <section id={sectionId} className={style.bannerSection}>
        <div className={style.bannerContainer}>
          <div className={style.top}>
            <h1 className={style.topTitle}>{t('news')}</h1>
          </div>
        </div>
      </section>
      <BackToTop resetScrollNavigation={scrollToTop} />
    </MainLayout>
  );
};

export default News;
