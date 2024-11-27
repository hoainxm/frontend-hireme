/** @format */

import Account from '@images/Account.svg';
import AccountBlack from '@images/AccountBlack.svg';
import React, { FC, useState } from 'react';
import { Image, NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router-dom';
import { UserProfile } from '../../../../app/auth/models';
import { IconMapName, SVGIcon } from '../../../../common/ui/assets/icon';
import { NOT_SET, PROFILE_ITEMS } from '../../../../common/utils/constants';
import { Confirm } from '../../../../common/utils/popup';
import { PageURL, Palette, ScopeKey, SectionID } from '../../../../models/enum';
import style from './profile.module.scss';
import useLocalStorage from '@hooks/useLocalStorage';
import { useAppDispatch } from '../../../../store/store';
import { logoutThunk } from '../../../../store/reducer/userSlice/userThunk';

interface Props {
  userInfo: UserProfile | null;
}

export const HeaderProfile: FC<Props> = (props: Props) => {
  const { userInfo } = props;

  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // const [_, setStoredValue] = useLocalStorage(ScopeKey.SELECTED_SECTION_DOT, SectionID.OCR_BANNER);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const logout = (): void => {
    Confirm.logout({
      title: t('auth.logout'),
      content: t('auth.logout.question'),
      onConfirm: async () =>
        // doLogout().then(async () => {
        //   setStoredValue(SectionID.HOME_BANNER);
        //   makeClientToUnauthorize({ isSysAdmin: false });
        //   localStorage.removeItem(ScopeKey.USER);
        // }),
        {
          await dispatch(logoutThunk());
          history.push(PageURL.HOME);
        },
    });
  };

  const toggleOpenDropDown = () => {
    setIsOpen((prev) => !prev);
  };

  const renderTitle = () => {
    const avatarSrc =
      userInfo && userInfo.avatar?.startsWith('http')
        ? userInfo.avatar
        : userInfo
        ? `${process.env.REACT_APP_API_URL}/images/avatar/${userInfo.avatar || ''}`
        : Account;

    return (
      <div className={style.profile}>
        <Image key={avatarSrc} src={avatarSrc} className={style.avt} />
        <SVGIcon icon={isOpen ? 'ArrowUp' : 'ArrowDown'} color={Palette.WHITE} size={16} />
      </div>
    );
  };

  return (
    <NavDropdown id='nav-profile' className={style.profileContainer} onToggle={toggleOpenDropDown} title={renderTitle()}>
      {userInfo !== null && (
        <div className={style.userBox}>
          <Image
            src={
              userInfo.avatar?.startsWith('http')
                ? userInfo.avatar
                : `${process.env.REACT_APP_API_URL}/images/avatar/${userInfo.avatar || ''}` || AccountBlack
            }
            className={style.avt}
          />
          <div className={style.userInfoBox}>
            <div className={style.userName}>{userInfo?.name || 'Not Available'}</div>
            <div className={style.userEmail}>{userInfo?.email || 'Not Available'}</div>
          </div>
        </div>
      )}
      <NavDropdown.Divider className={style.divider} />
      {PROFILE_ITEMS.map((product, index) => (
        <NavDropdown.Item key={index} className={style.profileItem} onClick={() => history.push(product.url)}>
          <SVGIcon icon={product.icon as keyof typeof IconMapName} color={Palette.BLUE} size={24} />
          <div className={style.font}>{t(product.name)}</div>
        </NavDropdown.Item>
      ))}
      <NavDropdown.Divider className={style.divider} />
      <NavDropdown.Item onClick={logout} className={style.profileItem}>
        <SVGIcon icon='Logout' color={Palette.BLUE} size={24} />
        <div className={style.font}>{t('auth.logout')}</div>
      </NavDropdown.Item>
    </NavDropdown>
  );
};
