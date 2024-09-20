/** @format */

import React, { FC, HTMLAttributes } from "react";
import style from "./btn.module.scss";

interface Props extends HTMLAttributes<HTMLElement> {}

const CButtonMenu: FC<Props> = (props: Props) => {
  return (
    <div className={`${style.menu} ${props.className}`}>{props.children}</div>
  );
};

export default CButtonMenu;
