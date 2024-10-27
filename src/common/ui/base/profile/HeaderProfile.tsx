/** @format */

import Account from '@images/Account.svg';
import React, { FC, useState } from 'react';
import { Image, NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { UserProfile } from '../../../../app/auth/models';
import { IconMapName, SVGIcon } from '../../../../common/ui/assets/icon';
import { doLogout } from '../../../../common/ui/layout/api';
import { makeClientToUnauthorize } from '../../../../common/utils/common';
import { NOT_SET, PROFILE_ITEMS } from '../../../../common/utils/constants';
import { Confirm } from '../../../../common/utils/popup';
import { Palette, ScopeKey, SectionID } from '../../../../models/enum';
import style from './profile.module.scss';
import useLocalStorage from '@hooks/useLocalStorage';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';
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
  const [_, setStoredValue] = useLocalStorage(ScopeKey.SELECTED_SECTION_DOT, SectionID.OCR_BANNER);
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
        },
    });
  };

  const toggleOpenDropDown = () => {
    setIsOpen((prev) => !prev);
  };

  const renderTitle = () => {
    return (
      <div className={style.profile}>
        <Image src={userInfo?.avatar ? userInfo.avatar : Account} className={style.avt} />
        <p>{userInfo?.name || NOT_SET}</p>
        <SVGIcon icon={isOpen ? 'ArrowUp' : 'ArrowDown'} color={Palette.WHITE} size={16} />
      </div>
    );
  };

  return (
    <NavDropdown id='nav-profile' className={style.profileContainer} onToggle={toggleOpenDropDown} title={renderTitle()}>
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
