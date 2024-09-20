import React, { FC } from 'react';
import { Col, Image, Modal, Row } from 'react-bootstrap';
import style from '../../layout/popup-layout/component/popup.module.scss';
import Loading from '@images/Loading.png';

interface Props {
  isOpen: boolean;
  title: string;
  content: string;
}

export const PopupLoading: FC<Props> = (props) => {
  const { isOpen, title, content } = props;

  return (
    <Modal show={isOpen} centered dialogClassName={style.modalContainer}>
      <Modal.Body className={style.genericUI}>
        <Row>
          <Col className='d-flex flex-column justify-content-center align-items-center'>
            <Image src={Loading} className={`${style.contentImg} ${style.loading}`} />
            <div className={style.uTitle}>{title}</div>
            <div className={`${style.content} mb-0`}>{content}</div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};
