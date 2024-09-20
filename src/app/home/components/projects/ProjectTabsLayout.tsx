import React, { Children, HTMLAttributes, PropsWithChildren, ReactElement, ReactNode, isValidElement, useEffect, useState } from 'react'
import style from './projects.module.scss'
import { TabItem } from '../../../../common/ui/layout/model';
import { useTranslation } from 'react-i18next';
import { TYPICAL_PROJECT_TABS } from '../../constant';

interface Props extends HTMLAttributes<HTMLElement> {
  tabs: Array<TabItem>;
  tabsClassName?: string
}

export const ProjectTabsLayout = (props: PropsWithChildren<Props>): ReactElement => {
  const { tabs } = props
  const { t } = useTranslation()

  const [active, setActive] = useState<string>();
  const [content, setContent] = useState<ReactNode>();

  const handleSetActive = (tabContentId: string) => {
    setActive(tabContentId)
    setContent(
      Children.map(props.children, (child) => {
        if (isValidElement(child) && child.props.id === tabContentId) {
          return child;
        }
        return null;
      })
    );
  };

  useEffect(() => {
    handleSetActive(tabs.length > 0 ? tabs[0].contentId: TYPICAL_PROJECT_TABS[0].contentId)
  }, []);

  return (
    <>
      <div className={`${style.projectTabs} ${props.tabsClassName}`}>
        {tabs.map((tab, index) => {
          const hasSlash = t(tab.name).includes("/")
          return (
            <div
              key={index}
              className={
                `${style.projectTab} ` +
                `${tab.contentId === active && style.active} ` +
                `${hasSlash && style.hasSlash}`
              }
              onClick={() => handleSetActive(tab.contentId)}
            >
              {t(tab.name)}
            </div>
          )
        })}
      </div>
      <div className={style.projectContent}>{content}</div>
    </>
  )
}