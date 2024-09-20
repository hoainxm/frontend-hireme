import React, { ReactElement, useEffect, useState } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { Palette, ScopeKey, ScopeValue } from '../../../../models/enum';
import { useTranslation } from 'react-i18next';
import style from './dropdown.module.scss';
import { IconMapName, SVGIcon } from '../../assets/icon';

interface Props {
  showLabel?: boolean;
  isOnHeader?: boolean;
  colorArrow?: Palette;
}

export const LanguageDropDown = (props: Props): ReactElement => {
  const { showLabel = true, isOnHeader = false, colorArrow = Palette.BLACK } = props;
  const { i18n, t } = useTranslation();

  const [lang, setLang] = useState<ScopeValue>(ScopeValue.VIE);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const LANGUAGES: { [id: string]: { icon: keyof typeof IconMapName; label: string } } = {
    [ScopeValue.VIE]: {
      icon: 'FlagVietnam',
      label: 'language.vie',
    },
    [ScopeValue.ENG]: {
      icon: 'FlagUSA',
      label: 'language.eng',
    },
  };

  const renderTitle = (lang: ScopeValue): ReactElement => {
    return (
      <div className={`${style.wrapper} ${isOnHeader && style.isOnHeader}`}>
        <div className={`${showLabel && style.showLabel}`}>
          <SVGIcon icon={LANGUAGES[lang].icon} size={24} className={style.flag} />
          {showLabel && <p>{t(LANGUAGES[lang].label)}</p>}
        </div>
        <SVGIcon icon={isOpen ? 'ArrowUp' : 'ArrowDown'} color={colorArrow} size={16} />
      </div>
    );
  };

  const toggleOpenDropDown = () => {
    setIsOpen((prev) => !prev);
  };

  const swapLanguage = (lang: ScopeValue): void => {
    localStorage.setItem(ScopeKey.LANG, lang);
    setLang(lang);
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    let lang = localStorage.getItem(ScopeKey.LANG);
    if (!lang) lang = ScopeValue.VIE;
    swapLanguage(lang as ScopeValue);
    // eslint-disable-next-line
  }, []);

  return (
    <NavDropdown
      id='nav-language'
      alignRight
      className={`${style.lang} ${isOnHeader && style.isOnHeader}`}
      title={renderTitle(lang as ScopeValue)}
      onToggle={toggleOpenDropDown}
    >
      {Object.entries(LANGUAGES).map(([key, value], index) => (
        <NavDropdown.Item key={index} className={style.langItem} onClick={() => swapLanguage(key as ScopeValue)}>
          <SVGIcon icon={value.icon} size={24} />
          <p>{t(value.label)}</p>
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};
