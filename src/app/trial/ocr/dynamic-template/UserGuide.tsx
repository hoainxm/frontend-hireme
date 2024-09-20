import React, { FC, HTMLAttributes, useEffect, useState } from 'react';
import style from './dynamicTemplate.module.scss';
import { useTranslation } from 'react-i18next';
import { DescriptionModal } from '../../shared/DescriptionModal';
import Info from '@icon/Information.svg';
import { Form, Image } from 'react-bootstrap';
import { CCollapse, CPanel } from '@base/collapse';
import { LCD_DYNAMIC_EXTRACTED_CASES, PAPER_DYNAMIC_EXTRACTED_CASES } from './constant';
import { CaseErrorField } from '../../shared/CaseErrorField';
import image1 from '@images/CreateTemplate1.jpg';
import image2 from '@images/CreateTemplate2.jpg';
import image3 from '@images/CreateTemplate3.jpg';
import image4 from '@images/UseTemplate1.jpg';
import image5 from '@images/UseTemplate2.jpg';
import { CSwiper } from '@base/swiper';
import { useLocation } from 'react-router-dom';

interface Props extends HTMLAttributes<HTMLDivElement> {
  activeKey?: number;
}

const CreateTemplateImages = [
  <Image className={style.image} src={image1} />,
  <Image className={style.image} src={image2} />,
  <Image className={style.image} src={image3} />,
];

const UseTemplateImages = [<Image className={style.image} src={image4} />, <Image className={style.image} src={image5} />];

export const UserGuide: FC<Props> = (props) => {
  const { t } = useTranslation();

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(true);
  const location = useLocation();
  const stateLocation = location.state as {activePanel: number};
  const [activePanelIndex, setActivePanelIndex] = useState<number>(0);

  const toggleInformation = () => setShowPopup(!showPopup);

  const handleCheckboxChange = (value: boolean) => {
    setDontShowAgain(value);
    localStorage.setItem('dontShowAgain', JSON.stringify(value));
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    const storedShowAgain = localStorage.getItem('dontShowAgain');
    setDontShowAgain(storedShowAgain ? JSON.parse(storedShowAgain) : true);

    if (storedShowAgain === null || storedShowAgain === 'false') setShowPopup(true);

    if (stateLocation) {
      setShowPopup(true);
      setActivePanelIndex(stateLocation.activePanel);
    }
    window.history.replaceState({}, '');
  }, []);

  useEffect(() => {
    if (props.activeKey !== undefined) {
      setShowPopup(true);
      setActivePanelIndex(props.activeKey);
    }
  }, [props.activeKey])

  return (
    <>
      <Image src={Info} onClick={toggleInformation} />
      <DescriptionModal
        title={t('product.ocr.instructionDynamicTemplates')}
        isOpen={showPopup}
        toggle={handlePopupClose}
        classContent={style.bodyModalContainer}
        children={
          <div className={style.userGuide}>
            <CCollapse isAccordion={true} defaultActiveKey={[activePanelIndex]}>
              <CPanel contentPanelClass={style.panel} header={t('product.ocr.createTemplateGuide')}>
                <CSwiper
                  navigation
                  pagination={{
                    clickableClass: style.pagination,
                  }}
                  typeActivePagination='dot'
                  className={style.cSwiper}
                  listSlide={CreateTemplateImages}
                  isAutoPlay={true}
                  isZoom={false}
                  isLoop={false}
                  autoPlayTimeDelay={30000}
                />
              </CPanel>
              <CPanel contentPanelClass={style.panel} header={t('product.ocr.useTemplateGuide')}>
                <CSwiper
                  navigation
                  pagination={{
                    clickableClass: style.pagination,
                  }}
                  typeActivePagination='dot'
                  className={style.cSwiper}
                  listSlide={UseTemplateImages}
                  isAutoPlay={true}
                  isZoom={false}
                  isLoop={false}
                  autoPlayTimeDelay={30000}
                />
              </CPanel>
              <CPanel header={t('imageRequirements')}>
                <div>
                  <h4 className={style.title}>{t('product.ocr.description.paper')}</h4>
                  <div className={style.caseErrorFields}>
                    {PAPER_DYNAMIC_EXTRACTED_CASES.map((c, index) => (
                      <div className={style.Item}>
                        <CaseErrorField key={index} image={c.image} content={c.content} />
                      </div>
                    ))}
                  </div>
                  <h4 className={style.title}>{t('product.ocr.description.lcd')}</h4>
                  <div className={style.caseErrorFields}>
                    {LCD_DYNAMIC_EXTRACTED_CASES.map((c, index) => (
                      <div className={style.Item}>
                        <CaseErrorField key={index} image={c.image} content={c.content} />
                      </div>
                    ))}
                  </div>
                </div>
              </CPanel>
            </CCollapse>
            <div className={style.checkboxPanel}>
              <Form.Check
                custom
                id='lcd-choose'
                type='checkbox'
                name='type'
                checked={dontShowAgain}
                onChange={(e) => handleCheckboxChange(e.currentTarget.checked)}
                label={t('dontShowGuide')}
              />
            </div>
          </div>
        }
      />
    </>
  );
};
