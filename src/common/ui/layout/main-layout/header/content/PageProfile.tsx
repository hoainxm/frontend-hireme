/** @format */

import React, { FC } from 'react';
import { Image, NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import DefaultAvatar from '../../../../assets/ic/24px/user.svg';
import { doLogout } from '../../../api';
import style from '../header.module.scss';
import Logout from '../../../../assets/ic/16px/log_out.svg';
import Setting from '../../../../assets/ic/16px/settings_dark.svg';
import Help from '../../../../assets/ic/16px/help.svg';
import { useSelector, useDispatch } from 'react-redux';
import { UserProfile } from '../../../../../../app/auth/models';
import { RootState } from '../../../../../../store/rootReducer';
import { PageURL, ScopeKey } from '../../../../../../models/enum';
import { resetUserInfo } from '../../../slice';
import { makeClientToUnauthorize } from '../../../../../utils/common';
import { Confirm } from '../../../../../utils/popup';
import { resetPopup } from '../../../popup-layout/slice';

interface Props {
  isSysAdmin?: boolean;
}

const PageProfile: FC<Props> = (props: Props) => {
  const { isSysAdmin = false } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const userInfo: UserProfile | null = useSelector((state: RootState) => state.main.userInfo);
  const { t } = useTranslation();

  const logout = (): void => {
    Confirm.logout({
      title: t('auth.logout'),
      content: t('auth.logout.question'),
      onConfirm: () =>
        doLogout().then(() => {
          dispatch(resetUserInfo());
          dispatch(resetPopup());
          makeClientToUnauthorize({ isSysAdmin });
          localStorage.removeItem(ScopeKey.USER);
        }),
    });
  };

  return (
    <NavDropdown
      alignRight={window.screen.width > 992 ? true : false}
      title={<Image src={userInfo?.avatar ? userInfo.avatar : DefaultAvatar} className={style.avt} roundedCircle />}
      id='nav-profile'
      className={style.profile}
    >
      {!isSysAdmin && (
        <>
          <NavDropdown.Item onClick={() => history.push(PageURL.HOME)} className={style.itemUser}>
            <div className={style.wrapperUserProfile}>
              <h2 className={style.fullName}>{userInfo?.full_name}</h2>
              <div className={style.userId}>ID: @{userInfo?.user_id}</div>
            </div>
          </NavDropdown.Item>
          <NavDropdown.Item onClick={() => history.push(PageURL.HOME)} className={style.itemSetting}>
            <div className={style.font}>{t('setting.title')}</div>
            <Image src={Setting} />
          </NavDropdown.Item>
          <NavDropdown.Item onClick={() => history.push(`${PageURL.HOME}`)} className={style.itemSupport}>
            <div className={style.font}>{t('support.Support')}</div>
            <Image src={Help} />
          </NavDropdown.Item>
        </>
      )}

      <NavDropdown.Item onClick={logout} className={`${style.itemLogout} ${!isSysAdmin && style.itemLogoutBorder}`}>
        <div className={style.font}>{t('auth.logout')}</div>
        <Image src={Logout} />
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default PageProfile;
