import React, { FC } from 'react';
import style from './home.module.scss';
import { CANDIDATES, EMPLOYERS } from './constant';
import { RecruitingCard } from '../../common/ui/base/card';
import { useTranslation } from 'react-i18next';
import { SectionLayout } from '../../common/ui/layout/section-layout';
import { Image } from 'react-bootstrap';
import Left from '@images/LeftSide.svg';
import Right from '@images/RightSide.svg';

interface Props {
  sectionId: string;
}

export const RecrutingSection: FC<Props> = (props) => {
  const { sectionId } = props;
  const { t } = useTranslation();

  return (
    <SectionLayout id={sectionId} title='product.recruitingSection' subTitle='product.recruitingSection.subTitle'>
      <div className={style.recruitingRole}>
        <div className={style.left}>
          <Image src={Left} width='100%' />
          <div className={style.title}>{t('product.employer')}</div>
          <div className={style.gridLayout}>
            {EMPLOYERS.map((item, index) => (
              <RecruitingCard key={index} image={item.image} content={item.content} />
            ))}
          </div>
        </div>
        {/* <div className={style.center}>
          <Image src={Center} className={style.image} />
        </div> */}
        <div className={style.right}>
          <Image src={Right} width='100%' />
          <div className={style.title}>{t('product.candidate')}</div>
          <div className={style.gridLayout}>
            {CANDIDATES.map((item, index) => (
              <RecruitingCard key={index} image={item.image} content={item.content} />
            ))}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
};
