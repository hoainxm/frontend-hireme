import { Col, Container, Row } from 'react-bootstrap';
import React, { FC, HTMLAttributes, ReactNode } from 'react';

import { TrialMainLayout } from '@layout/trial-main-layout';
import style from './trialContent.module.scss';
import { SVGIcon } from '@icon/index';
import { useHistory } from 'react-router-dom';

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
  icon?: ReactNode;
  btnGroup?: ReactNode;
  backTo?: string;
}

export const TrialContentLayout: FC<Props> = (props) => {
  const { title, backTo } = props;
  const history = useHistory();

  return (
    <TrialMainLayout>
      <Container className={`${style.contentLayout} ${props.className}`}>
        <div className={style.header}>
          {backTo && <SVGIcon size={32} icon='ArrowLeft' className='mr-3' onClick={() => history.push(backTo)} />}
          <h3 className={style.title}>
            {title}
            <span>{props.icon}</span>
          </h3>
          <div className={style.btnGroup}>{props.btnGroup}</div>
        </div>
        <Row>
          <Col>
            <div className={style.content}>{props.children}</div>
          </Col>
        </Row>
      </Container>
    </TrialMainLayout>
  );
};
