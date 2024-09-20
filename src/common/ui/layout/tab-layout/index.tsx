/** @format */

import React, {
  Children,
  FC,
  HTMLAttributes,
  ReactNode,
  isValidElement,
  useEffect,
  useState,
} from "react";

import { TabItem } from "../model";
import style from "./tab.module.scss";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Props extends HTMLAttributes<HTMLElement> {
  tabs: Array<TabItem>;
  customSetActive?: (tabContentId: string) => void
}

const TabLayout: FC<Props> = (props: Props) => {
  const { tabs } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const [active, setActive] = useState<string | null>(null);
  const [content, setContent] = useState<ReactNode>();

  useEffect(() => {
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    let activeTabContentId: string | null = query.get("tab");

    if (!activeTabContentId && tabs.length > 0)
      activeTabContentId = tabs[0].contentId;

    setActive(activeTabContentId);

    setContent(
      Children.map(props.children, (child) => {
        if (isValidElement(child) && child.props.id === activeTabContentId) {
          return child;
        }
        return null;
      })
    );
    // eslint-disable-next-line
  }, [props.children]);

  const handleSetActive = (tabContentId: string) => {
    history.replace(`${history.location.pathname}?tab=${tabContentId}`);
  };

  return (
    <>
      <div className={style.header}>
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={
              `${style.tab} ` +
              `${index == 0 && style.isFirstItem} ` +
              `${tab.contentId === active && style.active}`
            }
            onClick={() => {
              props.customSetActive ? 
                props.customSetActive(tab.contentId) : handleSetActive(tab.contentId)
            }}
          >
            <span
              key={`sp${index}`}
              className={
                `${style.tabItem} ` +
                `${tab.contentId === active && style.active}`
              }
            >
              {t(tab.name)}
            </span>
          </div>
        ))}
      </div>
      <div className={style.tabContent}>
        <div className={style.content}>{content}</div>
      </div>
    </>
  );
};

export default TabLayout