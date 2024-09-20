/** @format */

import React, { FC, HTMLAttributes } from 'react';

import { Color } from '../../../../models/enum';
import style from './badge.module.scss';

interface Props extends HTMLAttributes<HTMLElement> {
  ctype: Color;
  id?: string;
}

const CBadge: FC<Props> = (props: Props) => {
  const LEVEL_MAP = {
    [Color.DANGER]: style.danger,
    [Color.SUCCESS]: style.success,
    [Color.WARNING]: style.warning,
    [Color.SECONDARY]: style.secondary,
    [Color.BLUE]: style.blue,
    [Color.ORANGE]: style.orange,
    [Color.LIGHT_RED]: style.lightRed,
    [Color.GRAY]: style.gray,
  };

  return (
    <div id={props.id} onClick={props.onClick} className={`${style.badge} ${LEVEL_MAP[props.ctype]} ${props.className}`}>
      {props.children}
    </div>
  );
};

export default CBadge;
