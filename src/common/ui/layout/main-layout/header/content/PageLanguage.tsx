/** @format */

import React, { FC, ReactElement, useEffect, useState } from "react";
import { Image, NavDropdown } from "react-bootstrap";
import style from "../header.module.scss";
import VIE from "../../../../assets/ic/Vie.svg";
import ENG from "../../../../assets/ic/Eng.svg";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { updateLang } from "../../../slice";
import { ScopeKey, ScopeValue } from "../../../../../../models/enum";

interface Props {}

const PageLanguage: FC<Props> = (props: Props) => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const LANG_ICON_MAP: { [id: string]: ReactElement } = {
    [ScopeValue.VIE]: <Image src={VIE} className={style.icon} />,
    [ScopeValue.ENG]: <Image src={ENG} className={style.icon} />,
  };

  const [activeIcon, setActiveIcon] = useState<ReactElement>(
    LANG_ICON_MAP[ScopeValue.VIE]
  );

  const swapLanguage = (lang: ScopeValue): void => {
    localStorage.setItem(ScopeKey.LANG, lang);
    lang === ScopeValue.VIE
      ? dispatch(updateLang("VI"))
      : dispatch(updateLang("ENG"));
    setActiveIcon(LANG_ICON_MAP[lang]);
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    let lang = localStorage.getItem(ScopeKey.LANG);
    if (!lang) lang = ScopeValue.VIE;
    swapLanguage(lang as ScopeValue);
    // eslint-disable-next-line
  }, []);

  return (
    <NavDropdown title={activeIcon} className={style.lang} id="nav-lang">
      <NavDropdown.Item
        className={style.langItem}
        onClick={(e) => swapLanguage(ScopeValue.VIE)}
      >
        <Image src={VIE} className={`${style.icon} ${style.shadow} `} rounded />
        <span>VIE</span>
      </NavDropdown.Item>
      <NavDropdown.Item
        className={style.langItem}
        onClick={(e) => swapLanguage(ScopeValue.ENG)}
      >
        <Image src={ENG} className={`${style.icon} ${style.shadow} `} rounded />
        <span>ENG</span>
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default PageLanguage;
