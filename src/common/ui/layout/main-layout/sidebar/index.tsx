/** @format */

import { Image, Nav, Overlay, Tooltip } from 'react-bootstrap';
import { PageName, PageURL } from '../../../../../models/enum';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ArrowDisable from '../../../assets/ic/16px/arrow/drop-dark.svg';
import ArrowDisableBlue from '../../../assets/ic/16px/arrow/enable.svg';
import ArrowEnable from '../../../assets/ic/16px/arrow/collapse/enable.svg';
import ArrowEnableDark from '../../../assets/ic/16px/arrow/enable-dark.svg';
import Home from '../../../assets/ic/24px/dashboard/home.svg';
import HomeBlue from '../../../assets/ic/24px/dashboard/home-blue.svg';
import { Link } from 'react-router-dom';
import { RootState } from '../../../../../store/rootReducer';
import { Shortcut } from '../../model';
import style from './sidebar.module.scss';
import { updateSideBar } from '../../slice';
import useOnClickOutside from '../../../../utils/hooks/useClickOutside';
import { useTranslation } from 'react-i18next';

interface Props {
  active: PageName;
  rightContainerRef: React.RefObject<HTMLDivElement>;
}

const SideBar: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { active, rightContainerRef } = props;
  const dispatch = useDispatch();
  const isExpand = useSelector((state: RootState) => state.sideBar.isExpand);
  const [showToolTip, setShowTooltip] = useState<string>('');
  const navRef: React.RefObject<HTMLDivElement> = useRef(null);

  const showSidebar = (isNotUpdateExpand = false) => {
    if (isExpand && isNotUpdateExpand) return;
    updatePaddingLeft(294);
    dispatch(updateSideBar(!isExpand));
  };

  const [pageShortcuts, setPageShortcuts] = useState<Array<Shortcut>>([
    {
      name: PageName.HOME,
      url: PageURL.HOME,
      isActive: false,
      icon: Home,
      iconSelected: HomeBlue,
      target: useRef(null),
    },
  ]);

  const checkShowSubItem = (name: string) => {
    const pshortcuts = pageShortcuts.map((ps) => {
      if (ps.name === name) {
        ps.isSubItemShow = !ps.isSubItemShow;
      }
      return ps;
    });
    setPageShortcuts(pshortcuts);
  };

  useOnClickOutside(navRef, () => dispatch(updateSideBar(false)));

  const setActive = (name: PageName): void => {
    const pshortcuts = pageShortcuts.map((ps) => {
      ps.isActive = ps.name === name;
      return ps;
    });
    setPageShortcuts(pshortcuts);
  };

  const setItemActive = (url: string): void => {
    const pshortcuts = pageShortcuts.map((ps) => {
      ps.subName?.forEach((sub) => {
        sub.isActive = sub.url === url;
        if (sub.url === url) {
          dispatch(updateSideBar(true));
        }
      });
      return ps;
    });

    setPageShortcuts(pshortcuts);
  };

  const updatePaddingLeft = (padding: number) => {
    rightContainerRef.current && rightContainerRef.current.setAttribute('style', `padding-left: ${padding}px`);
  };

  const forceCloseSideBar = () => {
    const pshortcuts = pageShortcuts.map((ps) => {
      ps.isSubItemShow = false;
      return ps;
    });
    setPageShortcuts(pshortcuts);
  };

  useEffect(() => {
    if (!isExpand) {
      forceCloseSideBar();
      const timer = setTimeout(() => {
        updatePaddingLeft(75);
      }, 1);
      return () => {
        clearTimeout(timer);
      };
    }
    // eslint-disable-next-line
  }, [isExpand]);

  const getPathName = () => {
    let pathName = window.location.pathname;
    if (pathName) pathName = `/${pathName.split('/')[1]}`;
    return pathName;
  };

  useEffect(() => {
    setItemActive(window.location.pathname);
    setActive(active);
    updatePaddingLeft(75);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Nav className={`${style.sideBar} ${isExpand && style.sideBarExpand}`} ref={navRef}>
        <ul
          className={style.menuItem}
          onMouseLeave={() => {
            setShowTooltip('');
          }}
        >
          {pageShortcuts.map((item, index) =>
            !item.subName ? (
              <div key={index}>
                <Nav.Item
                  key={index}
                  onClick={() => showSidebar()}
                  ref={item.target}
                  onMouseEnter={(e: any) => {
                    const target = e.target.parentElement.getAttribute('itemId') || e.target.getAttribute('itemId');
                    setShowTooltip(target);
                  }}
                >
                  <Link to={item.url} className={item.isActive ? `${style.eachName} ${style.isActive}` : style.eachName} itemID={item.name}>
                    <Image width={24} height={24} src={item.isActive ? item.iconSelected : item.icon} />
                    {isExpand && <span>{t(item.name)}</span>}
                  </Link>
                </Nav.Item>
                {item.target && showToolTip === item.name && !isExpand && (
                  <Overlay target={item.target.current} show={true} placement='right'>
                    <Tooltip id='shortcut-tooltip'>{t(item.name)}</Tooltip>
                  </Overlay>
                )}
              </div>
            ) : (
              <Nav.Item
                key={index + 10}
                ref={item.target}
                onMouseEnter={(e: any) => {
                  const target = e.target.parentElement.parentElement.getAttribute('itemId') || e.target.getAttribute('itemId');
                  setShowTooltip(target);
                }}
              >
                <div
                  className={item.isActive ? `${style.timeAttendance} ${style.isActive}` : style.timeAttendance}
                  onClick={() => {
                    showSidebar(true);
                    checkShowSubItem(item.name);
                    // setIsSubItemShow(!isSubItemShow);
                  }}
                  itemID={item.name}
                >
                  <div className='d-flex'>
                    <Image width={24} height={24} src={item.isActive ? item.iconSelected : item.icon} />
                    {isExpand && <span>{t(item.name)}</span>}
                  </div>
                  {isExpand && (
                    <Image
                      className={style.arrowIcon}
                      src={
                        item.isActive ? (item.isSubItemShow ? ArrowEnable : ArrowDisableBlue) : item.isSubItemShow ? ArrowEnableDark : ArrowDisable
                      }
                    />
                  )}
                </div>

                {item.isSubItemShow &&
                  item.subName.map((sub, index, arr) => {
                    return (
                      <Link
                        to={sub.url}
                        className={item.isActive ? `${style.dropDown} ${style.isActive}` : `${style.dropDown} `}
                        onClick={() => {
                          setItemActive(sub.url);
                        }}
                      >
                        <>
                          <span className={sub.isActive ? `${style.circle} ${style.isActiveCircle}` : style.circle}>{'• '}</span>
                          <span className={sub.isActive ? `${style.subItem} ${style.isActiveSubItem}` : style.subItem}>{t(sub.name)}</span>
                        </>
                      </Link>
                    );
                  })}
                {item.target && showToolTip === item.name && !isExpand && (
                  <Overlay target={item.target.current} show={true} placement='right'>
                    <Tooltip id='shortcut-tooltip'>{t(item.name)}</Tooltip>
                  </Overlay>
                )}
              </Nav.Item>
            )
          )}
        </ul>
      </Nav>
    </>
  );
};

export default SideBar;
