/** @format */

import React, { FC, ReactNode } from "react";
import { Modal, ModalProps } from "react-bootstrap";
import style from "./modal.module.scss";
interface Props extends ModalProps {
  modalHeader?: ReactNode | undefined;
  modalFooter?: ReactNode | undefined;
  toggle?: () => void;
  isOpened: boolean;
  bodyClassName?: string;
  headerClassName?: string;
}

const CModal: FC<Props> = (props: Props) => {
  const { modalHeader, children, isOpened, modalFooter, size = "lg" } = props;

  return (
    <>
      <Modal size={size} centered onHide={props.toggle} show={isOpened}>
        {modalHeader && (
          <Modal.Header
            closeButton
            className={`${props.headerClassName} ${style.header}`}
          >
            <Modal.Title>{modalHeader}</Modal.Title>
          </Modal.Header>
        )}
        <Modal.Body className={props.bodyClassName}>{children}</Modal.Body>
        {modalFooter ? <Modal.Footer>{modalFooter}</Modal.Footer> : null}
      </Modal>
    </>
  );
};

export default CModal;
