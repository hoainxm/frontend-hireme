import React, { FC } from 'react';
import { Container, Image, Navbar } from 'react-bootstrap';
import style from './trialHeader.module.scss';
import LogoWhite from '@images/LogoWhite.png';
import { useHistory } from 'react-router-dom';
import { ButtonSize, ButtonVariant, PageURL, Palette, ScopeKey, SectionID } from '@models/enum';
import { HeaderProfile } from '@base/profile/HeaderProfile';

import { RootState } from 'store/rootReducer';
import CButton from '@base/button';
import { LanguageDropDown } from '@base/dropdown/LanguageDropDown';
import { useTranslation } from 'react-i18next';
import useLocalStorage from '@hooks/useLocalStorage';
import { useAppSelector } from '../../../../../store/store';

interface Props {}

export const TrialHeader: FC<Props> = (props) => {
  const { t } = useTranslation();

  const userInfo = useAppSelector((state: RootState) => state.user.userProfile);

  const history = useHistory();
  const [_, setStoredValue] = useLocalStorage(ScopeKey.SELECTED_SECTION_DOT, SectionID.HOME_BANNER);

  const onClickLogo = () => {
    setStoredValue(SectionID.HOME_BANNER);
    setTimeout(() => {
      history.push(PageURL.HOME);
    }, 300);
  };

  return (
    <Navbar className={style.header} expand='lg'>
      <Container className={style.container}>
        <Navbar.Brand className={style.brand}>
          <Image src={LogoWhite} className={style.logo} onClick={onClickLogo} />
        </Navbar.Brand>
        <Navbar.Collapse id='trial-navbar-nav' className='justify-content-end'>
          <div className={style.navbar}>
            <HeaderProfile userInfo={userInfo} />
            <CButton label={t('contact')} size={ButtonSize.LARGE} variant={ButtonVariant.OUTLINE} className={style.btnContact} />
            <LanguageDropDown showLabel={false} isOnHeader={true} colorArrow={Palette.WHITE} />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
