/** @format */

import { PageName, PageURL, ScopeKey, ScopeValue } from '../../../../models/enum';
import React, { FC, HTMLAttributes, ReactNode, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Container } from 'react-bootstrap';
import Footer from './footer';
import Header from './header';
import { RootState } from '../../../../store/rootReducer';
import { configViewSetMeta } from '../../../../common/utils/common';
import { getUserProfile } from '../slice';
import style from './main.module.scss';
import { useHistory } from 'react-router-dom';

interface Props extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  active: PageName;
}

const MainLayout: FC<Props> = (props: Props) => {
  const { children, active } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const userInfo = useSelector((state: RootState) => state.main.userInfo);

  useEffect(() => {
    if (localStorage.getItem(ScopeKey.IS_SYSTEM_ADMIN) === ScopeValue.TRUE) {
      history.push(PageURL.ADMIN);
    } else {
      !userInfo && dispatch(getUserProfile());
    }
    configViewSetMeta('1.0', '0.3');
  }, []);

  return (
    <Suspense fallback={'Loading...'}>
      <main id='main' className={`position-relative ${props.className}`}>
        <Header active={active} />
        <Container className={style.container}>
          {children}
          <Footer />
        </Container>
      </main>
    </Suspense>
  );
};

export default MainLayout;
