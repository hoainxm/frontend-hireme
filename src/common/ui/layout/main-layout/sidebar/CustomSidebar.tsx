import React, { ReactElement, useEffect, useState } from 'react';
import { Modal, Nav } from 'react-bootstrap';
import style from './sidebar.module.scss';
import { NAV_ITEMS, PROFILE_ITEMS } from '../../../../utils/constants';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageName, Palette, ScopeKey } from '../../../../../models/enum';
import { NavItem } from '../../model';
import { IconMapName, SVGIcon } from '../../../assets/icon';
import { Confirm } from '../../../../utils/popup';
import { doLogout } from '../../api';
import { useDispatch } from 'react-redux';
import { makeClientToUnauthorize } from '../../../../utils/common';

interface Props {
  active: PageName;
  isShow: boolean;
  handleClose: () => void;
}

export const CustomSidebar = (props: Props): ReactElement => {
  const { isShow, handleClose, active } = props;
  const { t } = useTranslation();
  const history = useHistory();

  const [navItems, setNavItems] = useState<Array<NavItem>>(NAV_ITEMS);

  const setActive = (name: PageName): void => {
    const updateNavItems = navItems.map((item) => ({ ...item, isActive: item.name === name }));
    setNavItems(updateNavItems);
  };

  const logout = (): void => {
    Confirm.logout({
      title: t('auth.logout'),
      content: t('auth.logout.question'),
      onConfirm: () =>
        doLogout().then(() => {
          makeClientToUnauthorize({ isSysAdmin: false });
          localStorage.removeItem(ScopeKey.USER);
        }),
    });
  };

  useEffect(() => {
    setActive(active);
  }, []);

  return (
    <Modal show={isShow} dialogClassName={style.customDialog} contentClassName={style.contentDialog} onHide={handleClose} scrollable>
      <Modal.Header closeButton className={style.modalHeader} />
      <Modal.Body className={style.modalBody}>
        <Nav className={style.navbar}>
          {navItems.map((item, index) => (
            <Nav.Item key={index} className={style.navItem}>
              <Link to={item.url} className={item.isActive && style.isActive}>
                {t(item.name)}
              </Link>
            </Nav.Item>
          ))}
        </Nav>
      </Modal.Body>
      <Modal.Footer className={style.modalFooter}>
        <Nav className={style.navbar}>
          {PROFILE_ITEMS.map((product, index) => (
            <Nav.Item key={index} className={style.navItem} onClick={() => history.push(product.url)}>
              <SVGIcon icon={product.icon as keyof typeof IconMapName} color={Palette.BLUE} size={24} />
              <div className={style.font}>{t(product.name)}</div>
            </Nav.Item>
          ))}
          <Nav.Item onClick={logout} className={style.navItem}>
            <SVGIcon icon='Logout' color={Palette.BLUE} size={24} />
            <div className={style.font}>{t('auth.logout')}</div>
          </Nav.Item>
        </Nav>
      </Modal.Footer>
    </Modal>
  );
};
