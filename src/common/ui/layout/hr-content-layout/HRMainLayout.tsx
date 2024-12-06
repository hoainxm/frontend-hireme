/** @format */

import React, { FC, ReactNode, useEffect, useRef } from 'react';

import { Container } from 'react-bootstrap';
import Header from '../admin-main-layout/header';
import { PageName } from '../../../../models/enum';
import { configViewSetMeta } from '../../../utils/common';
import style from '../admin-main-layout/admin.module.scss';
import HRHeader from './HRHeader';

interface Props {
  children: ReactNode;
  active: PageName | string;
}

const HRMainLayout: FC<Props> = (props) => {
  const { children, active } = props;
  const closeIconRef = useRef(null);

  useEffect(() => {
    configViewSetMeta('1.0', '1.0');
  }, []);

  return (
    <main className={style.mainLayout}>
      <HRHeader active={active} />
      <Container id='mainContent' className={style.mainContent}>
        {children}
      </Container>
    </main>
  );
};

export default HRMainLayout;
