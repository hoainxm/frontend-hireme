/** @format */

import React, { FC, HTMLAttributes } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import CAlert from './component/Alert';
import CConfirm from './component/Confirm';

interface Props extends HTMLAttributes<HTMLElement> {}

const PopupLayout: FC<Props> = (props: Props) => {
  const alert = useSelector((state: RootState) => state.popup.alert);
  const confirm = useSelector((state: RootState) => state.popup.confirm);

  return (
    <section className='position-relative'>
      {props.children}
      <CAlert {...alert} />
      <CConfirm {...confirm} />
    </section>
  );
};

export default PopupLayout;
