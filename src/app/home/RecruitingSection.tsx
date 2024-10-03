import React, { FC } from 'react';
import style from './home.module.scss';
import { CANDIDATES, EMPLOYERS } from './constant';
import { ComputerVisionCard } from '../../common/ui/base/card';
import { useTranslation } from 'react-i18next';
import { SectionLayout } from '../../common/ui/layout/section-layout';
import { Image } from 'react-bootstrap';
import Center from '@images/ComputerVisionCenter.png';
import ComputerVisionLeft from '@images/ComputerVisionLeft.svg';
import ComputerVisionRight from '@images/ComputerVisionRight.svg';

interface Props {
  sectionId: string;
}

export const RecrutingSection: FC<Props> = (props) => {
  const { sectionId } = props;
  const { t } = useTranslation();

  return (
    <SectionLayout id={sectionId} title='product.recruitingSection' subTitle='product.recruitingSection.subTitle'>
      <div className={style.computerVision}>
        <div className={style.left}>
          <Image src={ComputerVisionLeft} width='100%' />
          <div className={style.title}>{t('product.employer')}</div>
          <div className={style.gridLayout}>
            {EMPLOYERS.map((item, index) => (
              <ComputerVisionCard key={index} image={item.image} content={item.content} />
            ))}
          </div>
        </div>
        {/* <div className={style.center}>
          <Image src={Center} className={style.image} />
        </div> */}
        <div className={style.right}>
          <Image src={ComputerVisionRight} width='100%' />
          <div className={style.title}>{t('product.candidate')}</div>
          <div className={style.gridLayout}>
            {CANDIDATES.map((item, index) => (
              <ComputerVisionCard key={index} image={item.image} content={item.content} />
            ))}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
};
