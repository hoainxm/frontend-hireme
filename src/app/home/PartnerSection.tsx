import { Palette } from '../../models/enum';
import { PartnerCard } from '../../common/ui/base/card';
import { SectionLayout } from '../../common/ui/layout/section-layout';
import { PARTNER_IMAGES } from './constant';
import style from './home.module.scss';
import React, { FC } from 'react';

interface Props {
  sectionId: string;
}

export const PartnerSection: FC<Props> = (props) => {
  const { sectionId } = props;

  // Tạo bản sao danh sách các đối tác để cuộn liên tục
  const duplicatedImages = [...PARTNER_IMAGES, ...PARTNER_IMAGES];

  return (
    <SectionLayout id={sectionId} title='title.ourPartner' backgroundColor={Palette.BLUE}>
      <div className={style['partners-container']}>
        <div className={style.partners}>
          {duplicatedImages.map((item, index) => (
            <PartnerCard key={`${item}_${index}`} image={item} />
          ))}
        </div>
      </div>
    </SectionLayout>
  );
};
