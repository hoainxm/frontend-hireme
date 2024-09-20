/** @format */

import CButton from '@base/button';
import Ask from '@images/Ask.png';
import ComingSoon from '@images/ComingSoon.png';
import Failed from '@images/Failed.png';
import Success from '@images/Success.png';
import Warning from '@images/Warning.png';
import React, { FC, useEffect, useState } from 'react';
import { Image, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Palette, PopupLevel } from '../../../../../models/enum';
import { SVGIcon } from '../../../assets/icon';
import { Alert } from '../../model';
import { resetAlert } from '../slice';
import style from './popup.module.scss';

interface Props extends Alert {}

const CAlert: FC<Props> = (props: Props) => {
  const { title, content, level, labelBtnCfm, onClose, onConfirm } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const ICON_MAP: { [key: number]: string } = {
    [PopupLevel.INFO]: Ask,
    [PopupLevel.SUCCESS]: Success,
    [PopupLevel.WARNING]: Warning,
    [PopupLevel.ERROR]: Failed,
    [PopupLevel.COMING_SOON]: ComingSoon,
  };

  const [isOpen, setOpen] = useState<boolean>();

  const toggle = (): void => setOpen(!isOpen);

  const reset = () => {
    toggle();
    setTimeout(() => {
      dispatch(resetAlert());
    }, 200);
  };

  const close = (): void => {
    if (onClose) onClose();
    reset();
  };

  const confirm = (): void => {
    if (onConfirm) onConfirm();
    else if (onClose) onClose();
    reset();
  };

  useEffect(() => {
    title && content && toggle();
  }, [title, content]);

  return (
    <Modal show={isOpen} centered dialogClassName={style.modalContainer}>
      <Modal.Body className={`${style.genericUI} popup modal-content`}>
        <SVGIcon icon='Close' size={16} color={Palette.BLACK} className={style.closeIcon} onClick={close} />
        <div className='d-flex flex-column justify-content-center align-items-center'>
          <Image src={ICON_MAP[level]} className={style.contentImg} />
          <div className={style.uTitle}>{title}</div>
          <div className={style.content}>{content}</div>
          <div className={style.buttonContainer}>
            <CButton className={style.fBtn} label={labelBtnCfm ? labelBtnCfm : t('popup.confirmBtn')} onClick={confirm} />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CAlert;
