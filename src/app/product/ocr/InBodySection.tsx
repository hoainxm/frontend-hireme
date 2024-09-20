import { SectionLayout } from '../../../common/ui/layout/section-layout';
import React, { FC } from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import style from './productOcr.module.scss';
import CButton from '@base/button';
import { useTranslation } from 'react-i18next';
import { CSwiper } from '@base/swiper';
import { CZoomVideo } from '@base/zoom-video';
import InbodyCapture from '@images/InbodyCapture.png';
import { getYoutubeLink } from '../../../common/utils/common';
import Effective from '@images/Effective.svg';
import Stopwatch from '@images/Stopwatch.svg';
import Ripple02 from '@images/Ripple02.svg';
import { ProductSpecs } from './components/ProductSpecs';
import InbodyInfo from '@images/InbodyInfo.png';
import { INBODY_CHARACTER_RECOGNITION, INBODY_FIELDS_EXTRACTION, YOUTUBE_VIDEO_ID } from '../../../common/utils/constants';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@models/rootReducer';
import { PageURL, ScopeKey, ScopeValue } from '@models/enum';

interface Props {
  sectionId: string;
}

const FirstSlide = () => {
  return <Image src={InbodyInfo} width='100%' height='100%' />;
};

const SecondSlide = () => {
  return (
    <div className={style.videoSlide}>
      <CZoomVideo imageCapture={InbodyCapture} src={getYoutubeLink(YOUTUBE_VIDEO_ID.INBODY)} />
    </div>
  );
};

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
                {t('characterRecognition')}: {INBODY_CHARACTER_RECOGNITION}
              </h4>
              <h4>
                {t('fieldsExtraction')}: {INBODY_FIELDS_EXTRACTION}
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

export const InBodySection: FC<Props> = (props) => {
  const { sectionId } = props;
  const { t } = useTranslation();

  const history = useHistory();
  const userInfo = useSelector((state: RootState) => state.main.userInfo);
  const isAuthenticated = localStorage.getItem(ScopeKey.IS_AUTHENTICATED);

  const checkAuthenticatedNavigate = () => {
    history.push(
      isAuthenticated === ScopeValue.TRUE && userInfo ? PageURL.OCR_IN_BODY : PageURL.LOGIN,
      { path: PageURL.OCR_IN_BODY }
    )
  }

  return (
    <SectionLayout id={sectionId}>
      <Row>
        <Col xs={6} className={style.col}>
          <CSwiper isAutoPlay isLoop className={style.swiperContainer} spaceBetween={8} listSlide={[FirstSlide, SecondSlide, ThirdSlide]} />
        </Col>
        <Col xs={1} />
        <Col xs={5} className={style.col}>
          <h1 className={style.title}>{t('product.ocr.inBody')}</h1>
          <h4 className={`${style.subTitle} mw-100`}>{t('product.ocr.inBody.description')}</h4>
          <CButton className={style.tryNow} label={t('btn.tryNow')} onClick={checkAuthenticatedNavigate} />
        </Col>
      </Row>
    </SectionLayout>
  );
};
