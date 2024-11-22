import React, { FC, useEffect } from 'react';
import { Container, Image, Nav, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import MainLogo from '../../../assets/ic/Logo.svg';
import style from './adminHeader.module.scss';
import { PageName } from '../../../../../models/enum';
import PageLanguage from '../../main-layout/header/content/PageLanguage';
import PageProfile from '../../main-layout/header/content/PageProfile';
import PageShortcut from '../content/PageShortcut';
import Menu from '../../../../../common/ui/assets/ic/24px/three-line.svg';
import Close from '../../../../../common/ui/assets/ic/24px/cancel.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { updateSideBar } from '../../slice';

interface Props {
  active: PageName | string;
  closeIconRef: React.MutableRefObject<null>;
}

const Header: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { active, closeIconRef } = props;

  const dispatch = useDispatch();
  const isExpand = useSelector((state: RootState) => state.sideBar.isExpand);

  const handleResize = () => {
    const main = document.getElementById('mainContent') as HTMLElement;
    const leftMenu = document.getElementById('leftMenu') as HTMLElement;
    main.style.paddingLeft = `${leftMenu.offsetWidth + 24}px`;
    if (!isExpand) {
      main.style.paddingLeft = `${80}px`;
    }
  };

  useEffect(() => {
    handleResize();
    // eslint-disable-next-line
  }, [isExpand]);

  return (
    <Navbar className={style.header} expand='lg'>
      <Container>
        <Navbar.Brand className={style.brand}>
          <div className={style.navbar}>
            <Image
              id='iconMenuAndClose'
              src={isExpand ? Close : Menu}
              className={style.menuIcon}
              ref={closeIconRef}
              onClick={() => {
                dispatch(updateSideBar(!isExpand));
              }}
            />
          </div>
          <div className={style.logo}>
            <Image src={MainLogo} className={style.logoImg} />
          </div>
          {/* <h4 className={style.title}>{t('title.name')}</h4> */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='collapse-navbar' />
        <Navbar.Collapse id='collapse-navbar' className='justify-content-end'>
          <Nav className={style.content}>
            <PageShortcut active={active} />
            <PageLanguage />
            <div className={style.diver}></div>
            <PageProfile isSysAdmin />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
