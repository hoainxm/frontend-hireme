import React, { FC, ReactNode, useCallback, useRef, useState } from 'react';
import { Modal, ModalBody } from 'react-bootstrap';
import style from './shared.module.scss';
import { useTranslation } from 'react-i18next';
import Webcam from 'react-webcam';
import CButton from '@base/button';
import { ButtonSize, ButtonVariant, Palette } from '@models/enum';
import { SVGIcon } from '@icon/index';

interface Props {
  isOpen: boolean;
  toggle: () => void;
  detectWebcamImage?: (imgSrc: string) => Promise<void>;
}

export const WebcamModal: FC<Props> = (props) => {
  const { isOpen, toggle, detectWebcamImage } = props;
  const { t } = useTranslation();

  const videoConstraints = {
    width: 2592,
    height: 1944,
  };
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [previewImgSrc, setPreviewImgSrc] = useState<string>('');

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc || '');
      setPreviewImgSrc(imageSrc || '');
    }
  }, [webcamRef, setImgSrc]);

  const clearImgSrc = () => {
    setImgSrc('');
    setPreviewImgSrc('');
  };

  const hideModal = () => {
    toggle();
    clearImgSrc();
  };

  return (
    <Modal show={isOpen} centered onHide={hideModal} dialogClassName={style.modalContainer}>
      <ModalBody className={style.modalBody}>
        <div className={style.modalHeader}>
          <h4 className={style.modalHeaderTitle}>{t('cfm.takePhotoCapture.title')}</h4>
          <SVGIcon icon='Close' size={24} color={Palette.BLACK} onClick={toggle} />
        </div>
        <div className={style.modalContent}>
          <div className={style.webCamContainer}>
            {imgSrc !== '' ? (
              <div>
                <h6>{t('photoCapture')}</h6>
                <img className={style.wrapperContainer} src={previewImgSrc} />
              </div>
            ) : (
              <div>
                <h6>{t('webcam')}</h6>
                <Webcam
                  ref={webcamRef}
                  className={style.wrapperContainer}
                  audio={false}
                  imageSmoothing
                  forceScreenshotSourceSize
                  screenshotFormat='image/jpeg'
                  videoConstraints={videoConstraints}
                />
              </div>
            )}
          </div>
          <div className={style.modalFooter}>
            {imgSrc ? (
              <div className={style.webcamBtnGroup}>
                <CButton
                  size={ButtonSize.LARGE}
                  variant={ButtonVariant.OUTLINE}
                  className={style.btnGotIt}
                  label={t('btn.back')}
                  onClick={clearImgSrc}
                />
                <CButton
                  size={ButtonSize.LARGE}
                  className={style.btnGotIt}
                  label={t('btn.detect')}
                  disabled={!detectWebcamImage}
                  onClick={() => {
                    detectWebcamImage && detectWebcamImage(imgSrc);
                    clearImgSrc();
                  }}
                />
              </div>
            ) : (
              <CButton size={ButtonSize.LARGE} className={style.btnGotIt} label={t('btn.capturePhoto')} onClick={capture} />
            )}
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
