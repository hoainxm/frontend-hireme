import React, { FC, HTMLAttributes } from "react";
import style from "./sort.module.scss";
import Up from "@icon/ArrowUpWhite.svg";
import Down from "@icon/ArrowDownWhite.svg";
import UpDown from "@icon/ArrowUpDownWhite.svg";
import { Image } from "react-bootstrap";
import { TYPE_SORT } from "common/utils/constants";

interface Props extends HTMLAttributes<HTMLElement> {
  type?: TYPE_SORT;
  handleSort?: (e: any) => void;
}

const Sort: FC<Props> = (props: Props) => {
  const { type = "none", handleSort } = props;
  return (
    <span
      id={props.id}
      onClick={handleSort}
      className={`${style.sortable} ${type === "asc" && style.asc} ${
        type === "desc" && style.desc
      }`}
    >
      <Image className={style.sort} src={UpDown} />
      <Image className={style.sortUp} src={Up} />
      <Image className={style.sortDown} src={Down} />
    </span>
  );
};

export default Sort;
