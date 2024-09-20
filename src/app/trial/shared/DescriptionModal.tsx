import { SVGIcon } from '@icon/index';
import { ButtonSize, Palette } from '@models/enum';
import React, { FC, ReactNode } from 'react';
import { Modal, ModalBody } from 'react-bootstrap';
import style from './shared.module.scss';
import CButton from '@base/button';
import { useTranslation } from 'react-i18next';

interface Props {
  title: string;
  isOpen: boolean;
  toggle: () => void;
  children?: ReactNode;
  classContent?: string;
}

export const DescriptionModal: FC<Props> = (props) => {
  const { title, isOpen, toggle, children } = props;
  const { t } = useTranslation();

  return (
    <Modal show={isOpen} centered onHide={toggle} dialogClassName={style.modalContainer}>
      <ModalBody className={style.modalBody}>
        <div className={style.modalHeader}>
          <h4 className={style.modalHeaderTitle}>{title}</h4>
          <SVGIcon icon='Close' size={24} color={Palette.BLACK} onClick={toggle} />
        </div>
        <div className={`${style.modalContent} ${props.classContent}`}>
          {children}
          <div className={style.modalFooter}>
            <CButton size={ButtonSize.LARGE} className={style.btnGotIt} label={t('btn.gotIt')} onClick={toggle} />
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
