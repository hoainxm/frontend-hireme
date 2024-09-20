/** @format */

import React, { FC } from 'react';
import { Container, Image, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import style from './footer.module.scss';
import LogoWhite from '@images/LogoWhite.png';
import { IconMapName, SVGIcon } from '../../../assets/icon';
import { Palette } from '../../../../../models/enum';
import { CONTACT_INFORMATION, NAV_ITEMS, SOCIAL_LINKS } from '../../../../utils/constants';

interface Props {}

const Footer: FC<Props> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <footer className={style.fContainer}>
      <Container className={style.fContentContainer}>
        <div className={style.fContent}>
          <div className={style.contentWrapper}>
            <Image src={LogoWhite} />
            <div className={style.contentContainer}>
              <div className={style.heading}>{t('contact.information')}</div>
              {CONTACT_INFORMATION.map((contact, index) => (
                <div key={index} className={style.contactItem}>
                  <SVGIcon icon={contact.icon as keyof typeof IconMapName} color={Palette.WHITE} size={16} />
                  <p>{t(contact.content)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={style.followWrapper}>
            <div className={style.followContainer}>
              <div className={style.heading}>{t('follow.us')}</div>
              <div className={style.social}>
                {SOCIAL_LINKS.map((social, index) => (
                  <a key={index} target='_blank' href={social.url}>
                    <SVGIcon icon={social.icon as keyof typeof IconMapName} color={Palette.WHITE} size={32} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Container className={style.fCopyRightContainer}>
        <div className={style.fCopyRight}>
          <div className={style.fCopyContent}>
            <div>© 2024 HireMe - {t('auth.rightsReserved')}</div>
            {/* Temporary Hidden */}
            {/* <Nav className={style.fBottomNav}>
              {NAV_ITEMS.map((item, index) => (
                <Nav.Item key={index} className={style.navItem}>
                  <Link to={item.url} className={item.isActive && style.isActive}>{t(item.name)}</Link>
                </Nav.Item>
              ))}
            </Nav> */}
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
