/** @format */

import React, { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ArrowDisable from "../../../assets/ic/16px/arrow/drop-dark.svg";
import ArrowEnable from "../../../assets/ic/16px/arrow/collapse/enable.svg";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PageName } from "../../../../../models/enum";
import { RootState } from "../../../../../models/rootReducer";
import { Shortcut } from "../../model";
import { shortcutData } from "../common";
import style from "../sidebar/adminSidebar.module.scss";
import { updateSideBar } from "../../slice";
import useOnClickOutside from "../../../../utils/hooks/useClickOutside";
import { useTranslation } from "react-i18next";

interface Props {
  active: string;
  sideBarRef: React.MutableRefObject<null>;
  closeIconRef?: React.MutableRefObject<null>;
}

const SideBar: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { active, sideBarRef, closeIconRef } = props;

  const dispatch = useDispatch();
  const isExpand = useSelector((state: RootState) => state.sideBar.isExpand);

  const [pageShortcuts, setPageShortcuts] =
    useState<Array<Shortcut>>(shortcutData);
  const dropDownRef = useRef(null);

  const setActive = (
    name?: PageName | string,
    subName?: PageName | string
  ): void => {
    const pshortcuts = pageShortcuts.map((ps) => {
      if (ps.subName && ps.subName?.length > 0) {
        ps.subName.forEach((sub) => {
          sub.isActive = sub.name === name;
        });
      }
      ps.isActive = ps.name === name;
      return ps;
    });
    setPageShortcuts(pshortcuts);
  };

  // eslint-disable-next-line
  useEffect(() => setActive(active), []);

  useOnClickOutside(
    sideBarRef,
    () => {
      if (isExpand) {
        dispatch(updateSideBar(!isExpand));
      }
    },
    [closeIconRef]
  );

  return (
    <div
      className={`${style.sideBar} ${isExpand && style.expand}`}
      id="leftMenu"
      ref={sideBarRef}
      onClick={() => {
        dispatch(updateSideBar(!isExpand));
      }}
    >
      <div className={style.mainShortCut}>
        {pageShortcuts.map((shortcut, index) =>
          !shortcut.subName ? (
            <div key={index}>
              <Link
                to={shortcut.url}
                className={
                  shortcut.isActive
                    ? `${style.shortcut} ${style.active}`
                    : style.shortcut
                }
              >
                <Image
                  width={24}
                  height={24}
                  src={
                    shortcut.isActive ? shortcut.iconSelected : shortcut.icon
                  }
                  className={style.shortcutIcon}
                />
                {isExpand && (
                  <span className={style.shortcutName}>{t(shortcut.name)}</span>
                )}
              </Link>
            </div>
          ) : (
            <div key={index} ref={dropDownRef}>
              <div
                className={
                  shortcut.isActive
                    ? `${style.shortcut} ${style.active}`
                    : style.shortcut
                }
              >
                <Image
                  width={24}
                  height={24}
                  src={
                    shortcut.isActive ? shortcut.iconSelected : shortcut.icon
                  }
                  className={style.shortcutIcon}
                />
                {isExpand && (
                  <div className={`w-100 d-flex justify-content-between pr-2`}>
                    <span className={style.shortcutName}>
                      {t(shortcut.name)}
                    </span>

                    <Image
                      className={style.arrowIcon}
                      src={shortcut.isActive ? ArrowEnable : ArrowDisable}
                    />
                  </div>
                )}
              </div>
              <ul>
                {isExpand &&
                  shortcut.subName.map((sub, index) => (
                    <Link to={sub.url} className={style.dropdownShortCut}>
                      <li
                        key={index}
                        className={
                          sub.isActive
                            ? `${style.subItem} ${style.subActive}`
                            : style.subItem
                        }
                      >
                        <span className={style.shortcutName}>
                          {t(sub.name)}
                        </span>
                      </li>
                    </Link>
                  ))}
              </ul>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SideBar;
