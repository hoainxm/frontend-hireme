/** @format */

import { ButtonSize, ButtonType, ButtonVariant, Palette } from '../../../../models/enum';
import { IconMapName, SVGIcon } from '../../assets/icon';
import React, { ButtonHTMLAttributes, FC } from 'react';

import style from './btn.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  iref?: React.LegacyRef<HTMLButtonElement>;
  buttonType?: ButtonType;
  size?: ButtonSize;
  variant?: ButtonVariant;
  icon?: keyof typeof IconMapName;
  loading?: boolean;
}

const CButton: FC<Props> = (props: Props) => {
  const { buttonType = ButtonType.PRIMARY, size = ButtonSize.NORMAL, variant = ButtonVariant.CONTAINED, loading = false } = props;

  const buttonClasses =
    `${style.btn} ` + `${style[buttonType]} ` + `${style[size]} ` + `${style[variant]} ` + `${loading && style.loading} ` + `${props.className}`;

  return (
    <button {...props} ref={props.iref} className={buttonClasses}>
      {props.label && props.label}
      {props.icon && <SVGIcon size={16} icon={loading ? 'Loading' : props.icon} className={loading && style.spinner} />}
      {loading && !props.icon && <SVGIcon size={16} icon='Loading' className={style.spinner} />}
      {props.children}
    </button>
  );
};

export default CButton;
