/** @format */

import React, { FC, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { DEFAULT_PAGE_SIZE_LIST } from "../../../../utils/constants";
import { CSelect } from "../../select";

import style from "./pageSize.module.scss";

interface Props extends HTMLAttributes<HTMLElement> {
  className?: string;
  sizeArr?: Array<number>;
  defaultPageSize?: number;
  totalData: number;
  unit?: string;
}

const CTPageSize: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const defaultSizeArr = DEFAULT_PAGE_SIZE_LIST;
  const sizeArr = (props.sizeArr ? props.sizeArr : defaultSizeArr).sort(
    (a, b) => a - b
  );

  const defaultPageSize = Array.from(sizeArr).some(
    (item) => item === props.defaultPageSize
  )
    ? props.defaultPageSize
    : sizeArr[0];

  // const checkDisplay = () => {
  //   return props.totalData >= sizeArr[0];
  // };

  return (
    <div className={`${style.pageSizeFrame} ${props.className}`}>
      {t("field.display")}
      <div className={style.selectPageSizeFrame}>
        <CSelect
          defaultValue={defaultPageSize}
          {...Object.assign({}, props, { iref: undefined, valid: undefined })}
          className={style.pageSize}
        >
          {sizeArr.length > 0 &&
            sizeArr.map((item, index) => (
              <option key={index} title={item.toString()} value={item}>
                {item}
              </option>
            ))}
        </CSelect>
        <div className={style.displayPageSize}>{props.defaultPageSize}</div>
      </div>
      {t("field.pagesize.in")} {props.totalData} {props.unit}
    </div>
  );
};

export default CTPageSize;
