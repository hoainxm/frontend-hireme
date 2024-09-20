import React, { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PageURL, Palette, SectionID, ScopeKey } from '../../../../../../models/enum';
import { PRODUCT_ITEMS } from '../../../../../utils/constants';
import { IconMapName, SVGIcon } from '../../../../assets/icon';
import style from './menu.module.scss';
import { MegaMenuItem } from '../../../model';
import { TruncatedTextTooltip } from '../../../../base/tool-tip/TruncatedTextTooltip';
import { splitArray } from '../../../../../utils/common';
import { useDispatch } from 'react-redux';
import { updateSectionDot } from '../../../../layout/slice';

export const MegaMenu = (): ReactElement => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const [firstLevelItems, setFirstLevelItems] = useState<{ [key: string]: MegaMenuItem }>(PRODUCT_ITEMS);
  const [selectedFirstLevel, setSelectedFirstLevel] = useState<string>('product.computerVision');
  const [selectedSecondLevel, setSelectedSecondLevel] = useState<string>('product.ocr');
  const [secondLevelItems, setSecondLevelItems] = useState(firstLevelItems[selectedFirstLevel].subName);
  const [thirdLevelItems, setThirdLevelItems] = useState(secondLevelItems?.[selectedSecondLevel].subName);

  const covertThirdLevelItems = thirdLevelItems ? Object.entries(thirdLevelItems).map(([key, value]) => ({ ...value, key: key })) : [];
  const splitThirdLevelItems = splitArray(covertThirdLevelItems);

  const handleChangeSelectedFirstLevel = (core: string) => {
    setSelectedFirstLevel(core);
  };

  const handleChangeSelectedSecondLevel = (app: string) => {
    setSelectedSecondLevel(app);
  };

  const directToSpecificPage = (path: string) => {
    history.push(path);
  };

  const directionToSpecificSection = (path: string, sectionId: SectionID) => {
    dispatch(updateSectionDot(sectionId));
    directToSpecificPage(path);
  };

  useEffect(() => {
    const updateFirstLevelItems = { ...firstLevelItems };
    updateFirstLevelItems[selectedFirstLevel].isActive = true;
    setFirstLevelItems(updateFirstLevelItems);
  }, [selectedFirstLevel]);

  useEffect(() => {
    setSecondLevelItems(firstLevelItems[selectedFirstLevel].subName);
  }, [selectedFirstLevel]);

  useEffect(() => {
    secondLevelItems && setThirdLevelItems(secondLevelItems[selectedSecondLevel].subName);
  }, [selectedSecondLevel]);

  return (
    <div className={style.productMenuContainer}>
      <div>
        {Object.entries(firstLevelItems).map(([key, value], index) => (
          <button
            key={index}
            className={`${style.productItem} ${value.isActive && style.isActive} ${style.firstLevel}`}
            disabled={value.isDisabled}
            onClick={() => handleChangeSelectedFirstLevel(key)}
          >
            {value.icon && (
              <div className={style.svgContainer}>
                <SVGIcon icon={value.icon as keyof typeof IconMapName} size={24} color={Palette.WHITE} />
              </div>
            )}
            <TruncatedTextTooltip id={key} tooltipContent={key} placement='bottom' className={value.isTitle && style.isTitle}>
              {t(key)}
            </TruncatedTextTooltip>
          </button>
        ))}
      </div>
      {secondLevelItems && (
        <div>
          {Object.entries(secondLevelItems).map(([key, value], index) => (
            <button
              key={index}
              className={`${style.productItem} ${selectedSecondLevel === key && style.isActive} ${style.secondLevel}`}
              disabled={value.isDisabled}
              onClick={() => directionToSpecificSection(value.url || PageURL.HOME, value.sectionId || SectionID.HOME_BANNER)}
              onMouseEnter={() => handleChangeSelectedSecondLevel(key)}
            >
              {value.icon && (
                <div className={style.svgContainer}>
                  <SVGIcon icon={value.icon as keyof typeof IconMapName} size={24} color={Palette.WHITE} />
                </div>
              )}
              <TruncatedTextTooltip id={key} tooltipContent={key} placement='bottom' className={value.isTitle && style.isTitle}>
                {t(key)}
              </TruncatedTextTooltip>
            </button>
          ))}
        </div>
      )}
      {thirdLevelItems && (
        <div className={style.productApp}>
          {splitThirdLevelItems.map((arr) => (
            <div>
              {arr.map((item, index) => (
                <button
                  key={index}
                  className={`${style.productItem} ${style.thirdLevel}`}
                  disabled={item.isDisabled}
                  onClick={() => directionToSpecificSection(item.url || PageURL.HOME, item.sectionId || SectionID.HOME_BANNER)}
                >
                  {item.icon && (
                    <div className={style.svgContainer}>
                      <SVGIcon icon={item.icon as keyof typeof IconMapName} size={24} color={Palette.WHITE} className={style.svg} />
                    </div>
                  )}
                  <TruncatedTextTooltip id={item.key} tooltipContent={item.key} placement='bottom' className={item.isTitle && style.isTitle}>
                    {t(item.key)}
                  </TruncatedTextTooltip>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
