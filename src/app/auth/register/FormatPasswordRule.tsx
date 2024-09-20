import React, { ReactElement, RefObject, useEffect } from 'react'
import { Overlay } from 'react-bootstrap'
import style from '../auth.module.scss'
import { useTranslation } from 'react-i18next';
import { 
  LOWERCASE_ONLY_PATTERN, 
  NUMERIC_ONLY_PATTERN, 
  PASSWORD_MAX_LENGTH, 
  SPECIAL_ONLY_PATTERN, 
  UPPERCASE_ONLY_PATTERN
} from '../../../common/utils/constants';

interface Props {
  value: string
  isFocus: boolean;
  target: RefObject<HTMLDivElement | null>; 
}

export const FormatPasswordRule = (props: Props): ReactElement => {
  const { value, isFocus, target } = props
  const { t } = useTranslation()

  const checkFormat = (value: string) => {
    const formatRules = [
      { id: 'length', regex: PASSWORD_MAX_LENGTH },
      { id: 'uppercase', regex: UPPERCASE_ONLY_PATTERN },
      { id: 'lowercase', regex: LOWERCASE_ONLY_PATTERN },
      { id: 'special', regex: SPECIAL_ONLY_PATTERN },
      { id: 'numeric', regex: NUMERIC_ONLY_PATTERN },
    ];

    formatRules.forEach((rule) => {
      const element = document.getElementById(rule.id);
      const isValid = rule.regex.test(value);

      if (element) {
        element.classList.remove(style.isInvalid);
        element.classList.add(isValid ? style.isValid : style.isInvalid);
      }
    });
  }

  useEffect(() => {
    isFocus && checkFormat(value)
  }, [value, isFocus])

  return (
    <Overlay
      target={target.current}
      show={isFocus}
      placement="bottom"
    >
      {(props) => (
        <div id="popover-format-password" {...props} className={style.formatPassword}>
          <div>{t("field.error.password.title")}:</div>
          <p id='length'>{t("field.error.password.maxLength")}</p>
          <p id='uppercase'>{t("field.error.password.uppercaseCharacter")}</p>
          <p id='lowercase'>{t("field.error.password.lowercaseCharacter")}</p>
          <p id='special'>{t("field.error.password.specialCharacter")}</p>
          <p id='numeric'>{t("field.error.password.numericCharacter")}</p>
        </div>
      )}
    </Overlay>
  )
}