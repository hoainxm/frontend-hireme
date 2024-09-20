import React, { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import style from './trialSidebar.module.scss';
import { Nav, Overlay } from 'react-bootstrap';
import { IconMapName, SVGIcon } from '../../../assets/icon';
import { PageName, PageURL, Palette } from '@models/enum';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@models/rootReducer';
import { updateSideBar } from '@layout/slice';
import { useTranslation } from 'react-i18next';
import { Shortcut } from '@layout/model';
import { Products } from './Products';
import { useHistory } from 'react-router-dom';

interface Props {
  containerRef: React.RefObject<HTMLDivElement>;
}

export const TrialSidebar: FC<Props> = (props) => {
  const { containerRef } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const { isExpand } = useSelector((state: RootState) => state.sideBar);

  const dispatch = useDispatch();
  const navRef = useRef<HTMLDivElement>(null);

  const [menuParent, setMenuParent] = useState<string>('');
  const [pageShortcuts, setPageShortcuts] = useState<Array<Shortcut>>([
    {
      name: PageName.COMPUTER_VISION,
      url: PageURL.COMPUTER_VISION,
      icon: 'CPV',
      isActive: false,
      isSubItemShow: false,
      target: useRef(null),
      subName: [
        {
          name: PageName.OCR,
          url: PageURL.OCR,
          isActive: false,

          isSubItemShow: false,
          target: useRef(null),
          subName: [
            {
              name: PageName.OCR_MEDICAL_DEVICE,
              url: PageURL.OCR_MEDICAL_DEVICE,
              isActive: false,
              isDisabled: false,
            },
            {
              name: PageName.OCR_IN_BODY,
              url: PageURL.OCR_IN_BODY,
              isActive: false,
              isDisabled: false,
            },
            {
              name: PageName.OCR_PRESCRIPTION,
              url: PageURL.OCR_PRESCRIPTION,
              isActive: false,
              isDisabled: false,
            },
            {
              name: PageName.OCR_CARD_ID,
              url: PageURL.OCR_CARD_ID,
              isActive: false,
              isDisabled: true,
            },
            {
              name: PageName.OCR_BILL,
              url: PageURL.OCR_BILL,
              isActive: false,
              isDisabled: true,
            },
            {
              name: PageName.OCR_LICENSE_PLATE,
              url: PageURL.OCR_LICENSE_PLATE,
              isActive: false,
              isDisabled: true,
            },
            {
              name: PageName.OCR_DYNAMIC_TEMPLATE,
              url: PageURL.OCR_DYNAMIC_TEMPLATE,
              isActive: false,
              isDisabled: false,
            },
          ],
        },
        {
          name: PageName.OD,
          url: '', //PageURL.OD,
          isActive: false,

          isSubItemShow: false,
          target: useRef(null),
          subName: [],
        },
      ],
    },
    {
      name: PageName.NATURAL_LANGUAGE,
      url: '',
      icon: 'NLP',
      isActive: false,
    },
    {
      name: PageName.DATA_ANALYTICS,
      url: '',
      icon: 'DA',
      isActive: false,
    },
    {
      name: PageName.AUDIO_SPEECH,
      url: PageURL.AUDIO_PROCESSING,
      icon: 'Speech',
      isActive: false,
      isSubItemShow: false,
      target: useRef(null),
      subName: [
        {
          name: PageName.TEXT_TO_SPEECH,
          url: PageURL.TEXT_TO_SPEECH,
          isActive: false,
          target: useRef(null),
        },
        {
          name: PageName.SPEECH_TO_TEXT,
          url: "",
          isActive: false,
          target: useRef(null),
        },
      ],
    },
  ]);

  const showSidebar = (isNotUpdateExpand = false) => {
    if (isExpand && isNotUpdateExpand) return;
    updatePaddingLeft(isExpand ? 340 : 120);
    dispatch(updateSideBar(!isExpand));
  };

  const forceCloseSideBar = () => {
    const updateShortcuts = pageShortcuts.map((ps) => {
      ps.isSubItemShow = false;
      return ps;
    });
    setPageShortcuts(updateShortcuts);
  };

  const updatePaddingLeft = (padding: number) => {
    containerRef.current && containerRef.current.setAttribute('style', `padding-left: ${padding}px; transition: padding 0.1s ease-in;`);
  };

  const checkShowSubItem = (name: string) => {
    const updatedShortcuts = pageShortcuts.map((ps) => {
      if (ps.name === name) {
        ps.isSubItemShow = !ps.isSubItemShow;
      }
      return ps;
    });
    setPageShortcuts(updatedShortcuts);
  };

  const updateActiveItem = (items: Array<Shortcut>, path: string): Array<Shortcut> => {
    return items.map((item) => {
      const isActive = item.url && path.startsWith(item.url) ? true : false;
      return {
        ...item,
        isActive,
        subName: item.subName ? updateActiveItem(item.subName, path) : [],
      };
    });
  };

  const onClickItem = (item: Shortcut) => {
    showSidebar(true);
    checkShowSubItem(item.name);
  };

  const onMouseEnterNavItem = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.target as HTMLDivElement;
    const target = el.getAttribute('itemId') || el.parentElement?.getAttribute('itemId');
    setMenuParent(target || '');
  };

  const clearMenuParentProduct = () => setMenuParent('');

  useEffect(() => {
    !isExpand && forceCloseSideBar();
    updatePaddingLeft(isExpand ? 340 : 120);
  }, [isExpand]);

  useEffect(() => {
    const updatePageShortcuts = updateActiveItem(pageShortcuts, window.location.pathname);
    setPageShortcuts(updatePageShortcuts);
  }, []);

  return (
    <Nav ref={navRef} className={style.sideBar} onMouseLeave={clearMenuParentProduct}>
      <Nav.Item className={style.navItem} onClick={() => showSidebar()}>
        <div className={style.menu}>
          <SVGIcon icon='Menu' color={Palette.BLUE} size={24} />
        </div>
      </Nav.Item>

      {pageShortcuts.map((ps, index) => (
        <Nav.Item key={index} className={style.navItem}>
          <div
            className={`${style.item} ${ps.isActive && style.isActive} ${ps.subName && ps.subName.length === 0 && style.isDisabled}`}
            onClick={() => !(ps.subName && ps.subName.length === 0) && onClickItem(ps)}
          >
            <SVGIcon size={24} icon={ps.icon as keyof typeof IconMapName} color={ps.isActive ? Palette.BLUE : Palette.FIFTH_GRAY} />
            {isExpand && <span className={style.text}>{t(ps.name)}</span>}
          </div>
          <div className={style.dropDown}>
            {ps.isSubItemShow &&
              ps.subName?.map((nav, index) => (
                <div key={index}>
                  <div ref={nav.target} className={style.subItem} onMouseEnter={onMouseEnterNavItem}>
                    <div
                      itemID={nav.name}
                      className={`${style.item} ${nav.isActive && style.isActive} ${!nav.url && style.isDisabled}`}
                      onClick={() => nav.url && !nav.subName?.length && history.push(nav.url)}
                    >
                      <p>{t(nav.name)}</p>
                      {nav.subName?.length !== 0 && <SVGIcon size={16} icon='ArrowRight' color={nav.isActive ? Palette.BLUE : Palette.FOURTH_GRAY} />}
                    </div>
                  </div>
                  {nav.target && menuParent === nav.name && (
                    <Overlay placement='right-start' target={nav.target.current} show={nav.subName && nav.subName.length > 0}>
                      {(props) => (
                        <div {...props} className={style.productsContainer}>
                          <Products products={nav.subName || []} />
                        </div>
                      )}
                    </Overlay>
                  )}
                </div>
              ))}
          </div>
        </Nav.Item>
      ))}
    </Nav>
  );
};
