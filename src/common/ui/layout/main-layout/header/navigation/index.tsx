import { HeaderProfile } from '@base/profile/HeaderProfile';
import React, { FC, useEffect, useState } from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { ButtonSize, ButtonVariant, PageName, PageURL, Palette, ScopeKey, SectionID } from '../../../../../../models/enum';
import { NAV_ITEMS } from '../../../../../utils/constants';
import { SVGIcon } from '../../../../assets/icon';
import { CButton } from '../../../../base';
import { LanguageDropDown } from '../../../../base/dropdown/LanguageDropDown';
import { NavItem } from '../../../model';
import style from '../header.module.scss';
import { updateSectionDot } from '@layout/slice';
import useLocalStorage from '@hooks/useLocalStorage';
import { Alert } from '../../../../../utils/popup';
import { useAppSelector, RootState } from '../../../../../../store/store';

interface Props {
  active: PageName;
}

export const TopNavigation: FC<Props> = (props) => {
  const { active } = props;
  const { t } = useTranslation();

  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const isFetchingProfile = useAppSelector((state: RootState) => state.user.isFetchingProfile);

  const userInfo = useAppSelector((state: RootState) => state.user.userProfile);

  const [_, setStoredValue] = useLocalStorage(ScopeKey.SELECTED_SECTION_DOT, SectionID.HOME_BANNER);
  const [navItems, setNavItems] = useState<Array<NavItem>>(NAV_ITEMS);
  const [showMegaMenu, setShowMegaMenu] = useState<boolean>(false);

  const setActive = (name: PageName): void => {
    const updateNavItems = navItems.map((item) => ({ ...item, isActive: item.name === name }));
    setNavItems(updateNavItems);
  };

  // const setProductActive = (): boolean => {
  //   return location.pathname === PageURL.PRODUCT_OCR || location.pathname === PageURL.PRODUCT_OD;
  // };

  const alertComingSoon = () =>
    Alert.comingSoon({
      title: t('comingSoon'),
      content: t('popup.comingSoon'),
      labelBtnCfm: t('btn.understood'),
    });

  const directToLoginPage = () => {
    history.push(PageURL.LOGIN, { path: window.location.pathname });
  };

  const directToPage = (url: string, sectionId: SectionID) => {
    if (url === PageURL.ABOUT_US || url === PageURL.NEWS) {
      alertComingSoon();
    } else {
      dispatch(updateSectionDot(sectionId));
      setStoredValue(sectionId);
      history.push(url);
    }
  };

  useEffect(() => {
    setActive(active);
  }, []);

  return (
    <Nav className={style.navbar}>
      {navItems.map((item, index) => {
        return item.name === PageName.PRODUCT ? (
          <NavDropdown
            key={item.name}
            id='product-mega-menu'
            show={showMegaMenu}
            className={style.navItem}
            onMouseEnter={() => setShowMegaMenu(false)}
            onMouseLeave={() => setShowMegaMenu(false)}
            title={
              <>
                {/* <p className={item.isActive || setProductActive() ? style.isActive : undefined}>{t(item.name)}</p> */}
                <SVGIcon icon={showMegaMenu ? 'ArrowUp' : 'ArrowDown'} color={Palette.WHITE} size={16} />
              </>
            }
          >
            {/* {showMegaMenu && <MegaMenu />} */}
          </NavDropdown>
        ) : (
          <Nav.Item key={item.name} className={style.navItem}>
            <p className={item.isActive && style.isActive} onClick={() => directToPage(item.url, item.sectionId)}>
              {t(item.name)}
            </p>
          </Nav.Item>
        );
      })}
      <div className={style.profileContainer}>
        {isFetchingProfile ? (
          <div>Loading...</div>
        ) : userInfo ? (
          <HeaderProfile userInfo={userInfo} />
        ) : (
          <CButton
            label={t('auth.login')}
            size={ButtonSize.LARGE}
            variant={ButtonVariant.OUTLINE}
            onClick={directToLoginPage}
            className={style.btnLogin}
          />
        )}
      </div>
      <LanguageDropDown showLabel={false} isOnHeader={true} colorArrow={Palette.WHITE} />
    </Nav>
  );
};
