/** @format */

import React, { FC, useEffect, useState } from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Shortcut } from "../../model";
import { PageName } from "../../../../../models/enum";
import style from "../header/adminHeader.module.scss";
import { shortcutData } from "../common";

interface Props {
  active: PageName | string;
}

const PageShortcut: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { active } = props;

  const [pageShortcuts, setPageShortcuts] =
    useState<Array<Shortcut>>(shortcutData);

  const setActive = (name: PageName | string): void => {
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
                  ? `${style.shortcut} ${style.active}`
                  : style.shortcut
              }
            >
              {shortcut.subName.map((sub, index) => (
                <NavDropdown.Item key={index} className={style.dropdownItem}>
                  <Link key={index} to={sub.url} className={style.subItem}>
                    {t(sub.name)}
                  </Link>
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav.Item>
        )
      )}
    </>
  );
};

export default PageShortcut;
