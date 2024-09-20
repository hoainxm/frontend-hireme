import React, { FC, HTMLAttributes, useEffect, useState, useTransition } from 'react';
import MainLayout from '../../common/ui/layout/main-layout';
import { PageName, PageURL, SectionID } from '../../models/enum';
import { useDispatch } from 'react-redux';
import { updateSectionDot } from '@layout/slice';
import { BackToTop } from '@base/button/BackToTop';
import { useTranslation } from 'react-i18next';
import style from './news.module.scss';
import Back from '@icon/Back.svg';

interface ICategory {
  id: number;
  label: string;
}

const CATEGORIES_DATA: Array<ICategory> = [
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
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();

  const handleBackButton = () => {
    // redirect to news page
  };

  const scrollToTop = () => {
    dispatch(updateSectionDot(SectionID.HOME_BANNER));
  };

  const handleElementClick = (category: ICategory) => {
    setSelectedCategory(category);
  };

  return (
    <MainLayout active={PageName.NEWS}>
      <section id={sectionId} className={style.bannerSection}>
        <div className={style.bannerContainer}>
          <div className={style.top}>
            <h1 className={style.topTitle}>{t('news.title.category')}</h1>
          </div>
        </div>
      </section>

      <div className={style.categoryContainer}>
        <div className={style.header}>
          <div className={style.backBtn} onClick={handleBackButton}>
            <img src={Back} alt='' />
            {t('all.news')}
          </div>
          <div className={style.selected}>{selectedCategory?.label}</div>
        </div>

        <div className={style.block}>
          <div className={style.categoryWapper}>
            <div className={style.title}>{t('category.list')}</div>
            {CATEGORIES_DATA.map((category, index) => (
              <div
                className={`${style.category} ${selectedCategory === category ? style.active : ''}`}
                key={index}
                onClick={() => handleElementClick(category)}
              >
                {category.label}
              </div>
            ))}
          </div>

          <div className={style.contentBlock}></div>
        </div>
      </div>
      <BackToTop resetScrollNavigation={scrollToTop} />
    </MainLayout>
  );
};

export default News;
