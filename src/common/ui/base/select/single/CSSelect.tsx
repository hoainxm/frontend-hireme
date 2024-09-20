/** @format */

import React, {
  Children,
  FC,
  isValidElement,
  RefObject,
  SelectHTMLAttributes,
  useEffect,
  useState,
  useRef,
  MouseEvent,
  UIEvent,
} from "react";
import { useTranslation } from "react-i18next";
import useOnClickOutside from "../../../../utils/hooks/useClickOutside";
import iStyle from "../../input/input.module.scss";
import { OptionItem, SelectedItem } from "../../model";
import style from "../select.module.scss";
import DropDown from "./DropDown";
import DropDownWithEdit from "./DropDownWithEdit";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  iref?:
    | string
    | ((instance: HTMLSelectElement | null) => void)
    | RefObject<HTMLSelectElement>;
  valid?: boolean;
  searchValueListener?: string;
  onSearch?: (data: string) => void;
  onChangeSelect?: (value: SelectedItem, name?: string) => void;
  bottom?: boolean;
  onClickEvent?: (e: MouseEvent<HTMLDivElement>) => void;
  cId?: string;
  onScrollContent?: (
    boundElem: HTMLDivElement | null,
    contentElem: HTMLTableElement | null
  ) => void;
  displayClass?: string;
  subName?: string;
  subPlaceholder?: string;
  hasSubInput?: boolean;
  isFitContentDropdown?: boolean;
  isAlignDropdownEnd?: boolean;
  canUncheck?: boolean;
}

const CSSelect: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { children, onSearch, isFitContentDropdown = true } = props;
  const { searchValueListener = "", valid = true, canUncheck = true } = props;
  const [options, setOptions] = useState<Array<OptionItem>>([]);
  const [isDropOpen, setDropOpen] = useState<boolean>(false);
  const [optSelected, setOptSelected] = useState<SelectedItem>();
  const [searchValue, setSearchValue] = useState<string>(searchValueListener);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [extraOption, setExtraOption] = useState<OptionItem>();
  const refSelect = useRef(null);
  const boundRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLTableElement | null>(null);

  const doSearch = (data: string) => {
    onSearch && onSearch(data);
    setSearchValue(data);
  };

  useOnClickOutside(refSelect, () => {
    setDropOpen(false);
    if (onSearch && isDropOpen && !optSelected?.value) {
      onSearch("");
      setSearchValue("");
    }
  });

  const onToggleOption = (value: string, e: MouseEvent<HTMLDivElement>) => {
    if (!canUncheck && value === optSelected?.value) return;

    let optionSelected: any = undefined;
    options.forEach((opt) => {
      if (opt.value === value) {
        opt.selected = !opt.selected;
        if (opt.selected) optionSelected = { ...opt };
      } else opt.selected = false;
    });
    console.log(optionSelected);

    setOptSelected(optionSelected);
    setOptions(Array.from(options));
    setDropOpen(!isDropOpen);
    props.onChangeSelect && props.onChangeSelect(optionSelected);
    props.onClickEvent && props.onClickEvent(e);
  };

  const onClickEvent = (e: MouseEvent<HTMLDivElement>): void => {
    !props.disabled && setDropOpen(!isDropOpen);
    props.onClickEvent && props.onClickEvent(e);
  };

  const onScroll = (e: UIEvent<HTMLElement>): void => {
    if (props.onScrollContent)
      props.onScrollContent(boundRef.current, contentRef.current);
  };

  const checkPositionDropdown = () => {
    return `${props.bottom ? style.bottom : style.top} ${
      props.isAlignDropdownEnd && style.alignEnd
    } ${isFitContentDropdown && style.fitContent}`;
  };

  useEffect(() => {
    const optionElems: Array<OptionItem> = [];
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === "option") {
        const selected =
          child.props.selected || props.defaultValue === child.props.value;

        const option = {
          title: child.props.title ? child.props.title : "N/a",
          value: child.props.value,
          elem: <div>{child.props.children}</div>,
          selected: selected,
        };

        optionElems.push(option);
        selected && setOptSelected({ ...option });
      }
    });
    setOptions(optionElems);
    // eslint-disable-next-line
  }, [children]);

  return (
    <div
      id={props.cId}
      className={
        `${style.cselect} ${props.className} ` +
        `${valid ? "isvalid" : "isinvalid"} cinput`
      }
      ref={refSelect}
    >
      <div
        onClick={(e) => onClickEvent(e)}
        className={`${iStyle.inputContainer} ${style.display} ${
          props.disabled && style.disabled
        } ${props.displayClass}`}
      >
        {optSelected ? (
          <div
            className={`${style.singleSelected} ${
              props.disabled && style.childDisabled
            } `}
          >
            <div className="text-truncate">{optSelected.title}</div>
          </div>
        ) : (
          <div className={style.hint}>
            {props.placeholder || t("field.hint.select")}
          </div>
        )}
      </div>
      {isDropOpen &&
        (props.hasSubInput ? (
          <DropDownWithEdit
            checkPositionDropdown={checkPositionDropdown}
            bottom={props.bottom}
            subName={props.subName}
            subPlaceholder={props.subPlaceholder}
            boundRef={boundRef}
            contentRef={contentRef}
            onScroll={onScroll}
            options={options}
            onToggleOption={onToggleOption}
            isEdited={isEdited}
            setIsEdited={setIsEdited}
            setOptSelected={setOptSelected}
            setExtraOption={setExtraOption}
          />
        ) : (
          <>
            <DropDown
              checkPositionDropdown={checkPositionDropdown}
              bottom={props.bottom}
              boundRef={boundRef}
              contentRef={contentRef}
              onScroll={onScroll}
              options={options}
              onToggleOption={onToggleOption}
              onSearch={doSearch}
              searchValueListener={searchValue}
              isSearch={onSearch !== undefined}
            />
          </>
        ))}
      <select
        {...Object.assign({}, props, { iref: undefined, valid: undefined })}
        ref={props.iref}
      >
        {extraOption && (
          <option value={extraOption.value} selected>
            {extraOption.title}
          </option>
        )}
        {!optSelected ? (
          <option disabled selected></option>
        ) : (
          options.map((option, index) => (
            <option key={index} value={option.value} selected={option.selected}>
              {option.title}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default CSSelect;
