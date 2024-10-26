import CButton from '@base/button';
import { CSwiper } from '@base/swiper';
import Effective from '@images/Effective.svg';
import MedicalDeviceBackground from '@images/MedicalDeviceBackground.png';
import Ripple02 from '@images/Ripple02.svg';
import Stopwatch from '@images/Stopwatch.svg';
import React, { FC } from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { SectionLayout } from '../../../common/ui/layout/section-layout';
import { PRESCRIPTION_FIELDS_EXTRACTION, PRESCRIPTION_CHARACTER_RECOGNITION } from '../../../common/utils/constants';
import { ButtonSize, PageURL, ScopeKey, ScopeValue } from '../../../models/enum';
import { ProductSpecs } from './components/ProductSpecs';
import style from './productOcr.module.scss';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';
import PrescriptionInfo from '@images/PrescriptionInfo.png';

interface Props {
  sectionId: string;
}

const FirstSlide = () => {
  return <Image src={PrescriptionInfo} width='100%' height='100%' />;
};

// const SecondSlide = () => {
//   return (
//     <div className={style.videoSlide}>
//       <CZoomVideo
//         imageCapture={HealthDeviceCapture}
//         src={getYoutubeLink(YOUTUBE_VIDEO_ID.MEDICAL_DEVICE)}
//       />
//     </div>
//   )
// }

const ThirdSlide = () => {
  const { t } = useTranslation();

  return (
    <div className={style.specSlide}>
      <Image src={Ripple02} className={style.secondRipple} />
      <div className={style.specAccuracy}>
        <ProductSpecs
          title={t('accuracy')}
          icon={Effective}
          isBorderContent
          contentClassName='text-nowrap'
          content={
            <>
              <h4>
                {t('characterRecognition')}: {PRESCRIPTION_CHARACTER_RECOGNITION}
              </h4>
              <h4>
                {t('fieldsExtraction')}: {PRESCRIPTION_FIELDS_EXTRACTION}
              </h4>
            </>
          }
        />
      </div>
      <div className={style.specSpeed}>
        <ProductSpecs
          title={t('highlight')}
          icon={Stopwatch}
          isReverse
          isBorderContent
          contentClassName={style.maxWidth360}
          content={<h4>{t('optimizedHardware')}</h4>}
        />
      </div>
    </div>
  );
};

export const PrescriptionSection: FC<Props> = (props) => {
  const { sectionId } = props;
  const { t } = useTranslation();

  const history = useHistory();
  const userInfo = useSelector((state: RootState) => state.main.userInfo);
  const isAuthenticated = localStorage.getItem(ScopeKey.IS_AUTHENTICATED);

  const checkAuthenticatedNavigate = () => {
    history.push(isAuthenticated === ScopeValue.TRUE && userInfo ? PageURL.OCR_PRESCRIPTION : PageURL.LOGIN, { path: PageURL.OCR_PRESCRIPTION });
  };

  return (
    <SectionLayout id={sectionId} backgroundImage={MedicalDeviceBackground}>
      <Row>
        <Col xs={6} className='text-left'>
          <h1 className={style.title}>{t('product.ocr.prescription')}</h1>
          <h4 className={style.subTitle}>{t('product.ocr.prescription.description')}</h4>
          <CButton className={style.tryNow} label={t('btn.tryNow')} size={ButtonSize.LARGE} onClick={checkAuthenticatedNavigate} />
        </Col>
        <Col xs={6}>
          <CSwiper isAutoPlay isLoop className={style.swiperContainer} spaceBetween={8} listSlide={[FirstSlide, ThirdSlide]} />
        </Col>
      </Row>
    </SectionLayout>
  );
};
