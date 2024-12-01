/** @format */

import { Col, Container, Row } from 'react-bootstrap';
import React, { FC, HTMLAttributes, ReactNode } from 'react';

import HRMainLayout from './HRMainLayout';
import { PageName } from '../../../../models/enum';
import { SVGIcon } from '../../assets/icon';
import style from '../admin-content-layout/adminContent.module.scss';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Props extends HTMLAttributes<HTMLElement> {
  btnGroup?: ReactNode;
  dropDefaultContent?: boolean;
  backTo?: string;
  activate: PageName | string;
  title?: string;
  backgroundClass?: string;
}

const HRContentLayout: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { dropDefaultContent = false, backTo, activate, title = t('default.page.title') } = props;

  return (
    <HRMainLayout active={activate}>
      <Container className={` ${style.contentLayout} ${props.className}`}>
        <Row className={style.header}>
          <Col className={style.title}>
            {backTo && <SVGIcon icon='PreviousPage' className='mr-2' size={32} onClick={() => history.push(backTo)} />}
            <h3>{title}</h3>
          </Col>
          <Col className={style.btn}>{props.btnGroup}</Col>
        </Row>
        <Row>
          <Col>
            {dropDefaultContent ? (
              <div className={style.padd}>{props.children}</div>
            ) : (
              <div className={`${style.content} ${props.backgroundClass}`}>{props.children}</div>
            )}
          </Col>
        </Row>
      </Container>
    </HRMainLayout>
  );
};

export default HRContentLayout;
