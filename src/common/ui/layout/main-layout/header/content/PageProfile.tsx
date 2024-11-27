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
import { useDispatch } from 'react-redux';
import { UserProfile } from '../../../../../../app/auth/models';

import { PageURL, ScopeKey } from '../../../../../../models/enum';
import { Confirm } from '../../../../../utils/popup';
import { useAppSelector, RootState } from '../../../../../../store/store';
import { logoutThunk } from '../../../../../../store/reducer/userSlice/userThunk';

interface Props {
  isSysAdmin?: boolean;
}

const PageProfile: FC<Props> = (props: Props) => {
  const { isSysAdmin = false } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const userInfo: UserProfile | null = useAppSelector((state: RootState) => state.user.userProfile);

  const { t } = useTranslation();

  const logout = (): void => {
    Confirm.logout({
      title: t('auth.logout'),
      content: t('auth.logout.question'),
      onConfirm: async () => {
        await dispatch(logoutThunk());
        history.push(PageURL.HOME);
      },
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
              {/* <h2 className={style.fullName}>{userInfo?.full_name}</h2>
              <div className={style.userId}>ID: @{userInfo?.user_id}</div> */}
              <h2 className={style.fullName}>{userInfo?.name}</h2>
              <div className={style.userId}>ID: @{userInfo?._id}</div>
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
