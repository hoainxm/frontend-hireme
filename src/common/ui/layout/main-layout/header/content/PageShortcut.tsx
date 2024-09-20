/** @format */

import React, { FC, useEffect, useState } from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PageName, PageURL } from "../../../../../../models/enum";
import { Shortcut } from "../../../model";
import style from "../header.module.scss";

interface Props {
  active: PageName;
}

const PageShortcut: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { active } = props;

  const [pageShortcuts, setPageShortcuts] = useState<Array<Shortcut>>([
    {
      name: PageName.HOME,
      url: PageURL.HOME,
      isActive: false,
    },
  ]);

  const setActive = (name: PageName): void => {
    const pshortcuts = pageShortcuts.map((ps) => {
      ps.isActive = ps.name === name;
      return ps;
    });
    setPageShortcuts(pshortcuts);
  };

  // eslint-disable-next-line
  useEffect(() => setActive(active), []);

  return (
    <>
      {pageShortcuts.map((shortcut, index) =>
        !shortcut.subName ? (
          <Nav.Item key={index}>
            <Link
              key={index}
              to={shortcut.url}
              className={
                shortcut.isActive
                  ? `${style.shortcut} ${style.active}`
                  : style.shortcut
              }
            >
              {t(shortcut.name)}
            </Link>
          </Nav.Item>
        ) : (
          <Nav.Item key={index}>
            <NavDropdown
              key={index}
              title={t(shortcut.name)}
              id={shortcut.isActive ? "nav-item-active" : "nav-item"}
              className={
                shortcut.isActive
                  ? `${style.timeAttendance} ${style.actived}`
                  : style.timeAttendance
              }
            >
              {shortcut.subName.map((sub, index) => (
                <div className={style.dropdown} key={index}>
                  <Link to={sub.url} key={index} className={style.subItem}>
                    {t(sub.name)}
                  </Link>
                </div>
              ))}
            </NavDropdown>
          </Nav.Item>
        )
      )}
    </>
  );
};

export default PageShortcut;
