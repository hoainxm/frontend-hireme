/** @format */

import React, { AnchorHTMLAttributes, FC } from "react";
import style from "./btn.module.scss";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {}

const CButtonItem: FC<Props> = (props: Props) => {
  return (
    <a {...props} className={style.item}>
      {props.children}
    </a>
  );
};

export default CButtonItem;
