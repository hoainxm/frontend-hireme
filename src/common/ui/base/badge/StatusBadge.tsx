import React, { MouseEventHandler } from 'react';

import { ReactComponent as Arrow } from '../../assets/ic/16px/arrow/down-arrow.svg';
import { StatusOptionColor } from '../../../../models/enum';
import style from './badge.module.scss';

type StatusSize = 'small' | 'normal' | 'large';

interface Props {
  text: string;
  color: StatusOptionColor;
  size?: StatusSize;
  isDropOpen?: boolean;
  handleClick?: MouseEventHandler<HTMLDivElement>;
  isShowDot?: boolean;
}

const StatusBadge = (props: Props) => {
  const { color, text, isDropOpen, size = 'normal', isShowDot = true } = props;

  const STATUS_COLOR_MAPPING = {
    [StatusOptionColor.RED]: style.red,
    [StatusOptionColor.GREEN]: style.green,
    [StatusOptionColor.LIGHT_BLUE]: style.lightBlue,
    [StatusOptionColor.BLUE]: style.blue,
    [StatusOptionColor.ORANGE]: style.orange,
    [StatusOptionColor.GRAY]: style.gray,
  };

  const colorStyle = `${STATUS_COLOR_MAPPING[color]} ${style[size]} ${props.handleClick && style.allowEdit}`;

  return (
    <div onClick={props.handleClick} className={`${style.inputContainer} ${colorStyle}`}>
      {isShowDot && <div className={`${style.dot} ${STATUS_COLOR_MAPPING[color]}`} />}
      <div className={`text-truncate ${style.textInput}`}>{text}</div>
      {isDropOpen !== undefined ? <Arrow className={`${style.arrowIcon} ${isDropOpen && style.rotate}`} fill={STATUS_COLOR_MAPPING[color]} /> : null}
    </div>
  );
};

export default StatusBadge;
