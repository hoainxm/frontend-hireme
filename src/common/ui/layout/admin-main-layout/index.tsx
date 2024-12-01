/** @format */

import React, { FC, ReactNode, useEffect, useRef } from 'react';

import { Container } from 'react-bootstrap';
import Header from './header';
import { PageName } from '../../../../models/enum';
import SideBar from './sidebar';
import { configViewSetMeta } from '../../../../common/utils/common';
import style from './admin.module.scss';
import { updateSideBar } from '../slice';
import { useDispatch } from 'react-redux';

interface Props {
  children: ReactNode;
  active: PageName | string;
}

const AdminMainLayout: FC<Props> = (props) => {
  const { children, active } = props;
  const closeIconRef = useRef(null);
  const sideBarRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    configViewSetMeta('1.0', '1.0');
    dispatch(updateSideBar(false));
    // eslint-disable-next-line
  }, []);

  return (
    <main className={style.mainLayout}>
      <Header active={active} closeIconRef={closeIconRef} />
      <SideBar active={active} sideBarRef={sideBarRef} closeIconRef={closeIconRef} />
      <Container id='mainContent' className={style.mainContent}>
        {children}
      </Container>
    </main>
  );
};

export default AdminMainLayout;
