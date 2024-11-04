import { ToastItem } from '@layout/model';
import { Palette, ToastPosition, ToastType } from '@models/enum';
import React, { FC } from 'react';
import Success from '@images/Success.png';
import Warning from '@images/Warning.png';
import Failed from '@images/Failed.png';
import Ask from '@images/Ask.png';
import style from './toast.module.scss';
import { Image } from 'react-bootstrap';
import { SVGIcon } from '../../assets/icon';
import { useDispatch, useSelector } from 'react-redux';
import { closeToast } from '@layout/slice';
import { RootState } from 'store/rootReducer';

interface Props extends Omit<ToastItem, 'duration'> {}

export const CToast: FC<Props> = (props) => {
  const { id, message, position = ToastPosition.TOP_RIGHT, type, title } = props;
  const { toastIdCounter } = useSelector((state: RootState) => state.toasts);
  const dispatch = useDispatch();

  const TYPE_MAP: { [key: number]: { image: string; type: string } } = {
    [ToastType.SUCCESS]: { image: Success, type: 'success' },
    [ToastType.WARNING]: { image: Warning, type: 'warning' },
    [ToastType.ERROR]: { image: Failed, type: 'error' },
    [ToastType.INFO]: { image: Ask, type: 'info' },
  };

  const onCloseToast = () => {
    dispatch(closeToast(toastIdCounter));
  };

  return (
    <div className={`${style.wrapperToast} ${position && style[position]} ${style[TYPE_MAP[type].type]}`}>
      <Image src={TYPE_MAP[type].image} className={style.icon} width={24} height={24} />
      <div className={style.main}>
        {props.children ? (
          props.children
        ) : (
          <>
            <p className={style.title}>{title}</p>
            <p className={style.content}>{message}</p>
          </>
        )}
      </div>
      <SVGIcon size={16} icon='Close' className={style.icon} color={Palette.FIFTH_GRAY} onClick={onCloseToast} />
    </div>
  );
};
