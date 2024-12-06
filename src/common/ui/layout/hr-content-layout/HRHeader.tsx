/** @format */

import React, { FC } from 'react';
import { Container, Image, Nav, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import MainLogo from '../../assets/ic/Logo.svg';
import style from '../admin-main-layout/header/adminHeader.module.scss';
import PageLanguage from '../main-layout/header/content/PageLanguage';
import PageProfile from '../main-layout/header/content/PageProfile';

interface Props {
  active: string;
}

const HRHeader: FC<Props> = ({ active }) => {
  const { t } = useTranslation();

  return (
    <Navbar className={style.header} expand='lg'>
      <Container>
        <Navbar.Brand className={style.brand}>
          <div className={style.logo}>
            <Image src={MainLogo} className={style.logoImg} />
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='collapse-navbar' />
        <Navbar.Collapse id='collapse-navbar' className='justify-content-end'>
          <Nav className={style.content}>
            <PageLanguage />
            <div className={style.diver}></div>
            <PageProfile isSysAdmin={false} />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HRHeader;
