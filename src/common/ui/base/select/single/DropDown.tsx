/** @format */

import React, { FC, SelectHTMLAttributes, MouseEvent, UIEvent } from "react";
import { Image } from "react-bootstrap";
import { OptionItem } from "../../model";
import style from "../select.module.scss";
import SearchBar from "../../search";
import { useTranslation } from "react-i18next";
import CheckBlue from "../../../assets/ic/16px/check-blue.svg";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  bottom?: boolean;
  boundRef: React.MutableRefObject<HTMLDivElement | null>;
  isSearch?: boolean;
  onScroll: (e: UIEvent<HTMLElement>) => void;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  options: Array<OptionItem>;
  onToggleOption: (value: string, e: MouseEvent<HTMLDivElement>) => void;
  onSearch?: (data: string) => void;
  checkPositionDropdown: () => string;
  searchValueListener?: string;
}

const DropDown: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { boundRef, contentRef, onScroll, options, onToggleOption, onSearch } =
    props;

  return (
    <div className={props.checkPositionDropdown()}>
      <div className={style.dropdown}>
        {props.isSearch && onSearch && (
          <div className={style.dropdownHeader}>
            <SearchBar
              className={style.search}
              onSearch={onSearch}
              searchValueListener={props.searchValueListener}
            />
          </div>
        )}
        <div
          className={style.dropdownContent}
          ref={boundRef}
          onScroll={onScroll}
        >
          <div ref={contentRef}>
            {options.map((option, index) => (
              <div
                key={index}
                className={`${
                  option.selected ? style.optionItemChoice : style.optionItem
                }`}
                onClick={(e) => onToggleOption(option.value, e)}
              >
                <div>{option.elem}</div>
                {option.selected && (
                  <Image src={CheckBlue} className={style.checkedItem} />
                )}
              </div>
            ))}
            {!options.length && (
              <div className={style.noData}>{t("field.data.noData")}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropDown;
