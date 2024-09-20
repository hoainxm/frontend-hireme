import React, { FC } from 'react';
import style from './home.module.scss';
import { Trans, useTranslation } from 'react-i18next';
import { BANNER_PRODUCT_ITEMS, STRENGTH_POINTS } from './constant';
import { SVGIcon } from '../../common/ui/assets/icon';
import { Palette } from '../../models/enum';
import { Col, Image, Row } from 'react-bootstrap';
import { CSwiper } from '@base/swiper';
import Solutions from '@images/Solutions.png';

interface Props {
  sectionId: string;
}

const FirstBanner: FC = () => {
  const { t } = useTranslation();

  return (
    <div className={style.wrapper}>
      <Row className={style.container}>
        <Col className={style.columnLeftFirstBanner}>
          <div className={style.left}>
            <h1>{t('title.name')}</h1>
            <h4 className='mt-3'>{t('home.banner02.content')}</h4>
            <div className={style.details}>
              {STRENGTH_POINTS.map((sp, index) => (
                <div key={index} className={style.detail}>
                  <div className={style.ellipse}>
                    <SVGIcon icon={sp.icon} color={Palette.WHITE} size={48} />
                  </div>
                  <h4>
                    <Trans i18nKey={sp.content} components={{ span: <span /> }} />
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </Col>
        <Col className={style.columnRightFirstBanner}>
          <Image src={Solutions} width='100%' />
        </Col>
      </Row>
    </div>
  );
};

// const SecondBanner: FC = () => {
//   const { t } = useTranslation();

//   return (
//     <div className={style.wrapper}>
//       <Row className={style.container}>
//         <Col className={style.columnLeftSecondBanner}>
//           <div className={style.left}>
//             <h1>{t('title.name')}</h1>
//             <h4 className='mt-3'>{t('home.banner01.content')}</h4>
//             <div className={style.details}>
//               {STRENGTH_POINTS.map((sp, index) => (
//                 <div key={index} className={style.detail}>
//                   <div className={style.ellipse}>
//                     <SVGIcon icon={sp.icon} color={Palette.WHITE} size={48} />
//                   </div>
//                   <h4>
//                     <Trans i18nKey={sp.content} components={{ span: <span /> }} />
//                   </h4>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Col>
//         <Col className={style.columnRightSecondBanner}>
//           <div className={style.brainContainer}>
//             {BANNER_PRODUCT_ITEMS.map((item, index) => (
//               <div key={index} className={`${style.bannerProductItem} ${style[item.styleName]}`}>
//                 <Image src={item.image} height={96} />
//                 <p className={style.content}>{t(item.productName)}</p>
//               </div>
//             ))}
//           </div>
//         </Col>
//       </Row>
//     </div>
//   );
// };

export const Banner: FC<Props> = (props) => {
  const { sectionId } = props;

  return (
    <section id={sectionId} className={style.bannerSection}>
      <CSwiper isContrast isAutoPlay isLoop isZoom isInFrontSlide className={style.wrapper} listSlide={[FirstBanner]} />
    </section>
  );
};

// export const Banner: FC<Props> = (props) => {
//   const { sectionId } = props;

//   return (
//     <section id={sectionId} className={style.bannerSection}>
//       <CSwiper isContrast isAutoPlay isLoop isZoom isInFrontSlide className={style.wrapper} listSlide={[FirstBanner, SecondBanner]} />
//     </section>
//   );
// };
