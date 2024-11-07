/** @format */

import React, { FC } from 'react';
import { Container, Image, Navbar } from 'react-bootstrap';

import LogoDefault from '@images/LogoWhite.png';

import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PageName, PageURL, ScopeKey, SectionID } from '../../../../../models/enum';
import { RootState } from '../../../../../store/rootReducer';
import style from './header.module.scss';

import useLocalStorage from '@hooks/useLocalStorage';
import { UserProfile } from '../../../../../app/auth/models';
import { CustomSidebar } from '../sidebar/CustomSidebar';
import { TopNavigation } from './navigation';

interface Props {
  active: PageName;
}

const Header: FC<Props> = (props: Props) => {
  const { active } = props;
  const userInfo: UserProfile | null = useSelector((state: RootState) => state.user.userProfile);

  const history = useHistory();
  const [_, setStoredValue] = useLocalStorage(ScopeKey.SELECTED_SECTION_DOT, SectionID.HOME_BANNER);
  const [showSidebar, setShowSidebar] = React.useState(false);

  const toggleShowSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const onClickLogo = () => {
    setStoredValue(SectionID.HOME_BANNER);
    setTimeout(() => {
      history.push(PageURL.HOME);
    }, 300);
  };

  return (
    <Navbar sticky='top' className={style.header}>
      <Container className={style.container}>
        <Navbar.Brand className={style.brand}>
          <Image src={LogoDefault} className={style.logo} onClick={onClickLogo} />
        </Navbar.Brand>
        {/* <Navbar.Toggle
          className="border-0"
          aria-controls="basic-navbar-nav"
          onClick={toggleShowSidebar}
          children={<SVGIcon icon="Hamburger" color={Palette.WHITE} size={32} />}
        /> */}
        <CustomSidebar active={active} isShow={showSidebar} handleClose={toggleShowSidebar} />
        <Navbar.Collapse id='basic-navbar-nav' className='justify-content-end'>
          <TopNavigation active={active} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
