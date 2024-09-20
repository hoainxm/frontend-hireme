/** @format */

import Ask from '@images/Ask.png';
import Failed from '@images/Failed.png';
import Success from '@images/Success.png';
import Warning from '@images/Warning.png';
import Delete from '@icon/Delete.svg';
import React, { FC, useEffect, useState } from 'react';
import { Col, Image, Modal, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ButtonVariant, Palette, PopupLevel } from '../../../../../models/enum';
import logoutIcon from '../../../assets/ic/100px/log-out.svg';
import deleteIcon from '../../../assets/ic/52px/bin.svg';
import { SVGIcon } from '../../../assets/icon';
import CButton from '../../../base/button';
import { Confirm, ConfirmBtnGroupConfig } from '../../model';
import { resetConfirm } from '../slice';
import style from './popup.module.scss';

interface Props extends Confirm {}

const CConfirm: FC<Props> = (props: Props) => {
  const { title, content, level, isCloseFlag, onCancel, onConfirm, onClose } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const ICON_MAP: { [key: number]: string } = {
    [PopupLevel.DANGER]: Failed,
    [PopupLevel.DELETE]: Delete,
    [PopupLevel.LOGOUT]: logoutIcon,
    [PopupLevel.SUCCESS]: Success,
    [PopupLevel.INFO]: Ask,
    [PopupLevel.WARNING]: Warning,
  };

  const configTitleAction: { [key: number]: ConfirmBtnGroupConfig } = {
    [PopupLevel.DELETE]: {
      confirmTitle: 'btn.remove',
      confirmClass: style.deleteBtn,
    },
  };

  const [isOpen, setOpen] = useState<boolean>();

  const toggle = (): void => setOpen(!isOpen);

  const close = (): void => {
    toggle();
    setTimeout(() => {
      dispatch(resetConfirm());
    }, 200);
  };

  const doClose = (): void => {
    onClose && onClose();
    close();
  };

  const doCancel = (): void => {
    onCancel && onCancel();
    close();
  };

  const doConfirm = (): void => {
    onConfirm && onConfirm();
    close();
  };

  useEffect(() => {
    if (isCloseFlag) setOpen(false);
  }, [isCloseFlag]);

  useEffect(() => {
    title && content && toggle();
  }, [title, content]);

  return (
    <Modal show={isOpen} centered dialogClassName={style.modalContainer}>
      <Modal.Body className={style.genericUI}>
        <SVGIcon icon='Close' size={16} color={Palette.BLACK} className={style.closeIcon} onClick={doClose} />
        <Row>
          <Col className='d-flex flex-column justify-content-center align-items-center'>
            <Image src={ICON_MAP[level]} className={style.contentImg} />
            <div className={style.uTitle}>{title}</div>
            <div className={style.content}>{content}</div>
            <div className={style.buttonContainer}>
              <CButton
                variant={ButtonVariant.OUTLINE}
                className={style.fBtn}
                label={t(configTitleAction[level]?.cancelTitle || props.labelBtnCancel || 'btn.cancel')}
                onClick={doCancel}
              />
              <CButton
                className={`${style.sBtn} ${configTitleAction[level]?.confirmClass}`}
                label={t(configTitleAction[level]?.confirmTitle || props.labelBtnCfm || 'popup.confirmBtn')}
                onClick={doConfirm}
              />
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};
export default CConfirm;
