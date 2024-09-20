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
import { OptionItem, SelectedItem } from "../../model";
import style from "../select.module.scss";
import DropDown from "./DropDown";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  iref?:
    | string
    | ((instance: HTMLSelectElement | null) => void)
    | RefObject<HTMLSelectElement>;
  cId?: string;
  valid?: boolean;
  isFitContentDropdown?: boolean;
  isAlignDropdownEnd?: boolean;
  bottom?: boolean;
  displayClass?: string;
  canUncheck?: boolean;
  isResetDropdown?: boolean;
  onClickEvent?: (e: MouseEvent<HTMLDivElement>) => void;
  onScrollContent?: (
    boundElem: HTMLDivElement | null,
    contentElem: HTMLTableElement | null,
    value?: string
  ) => void;
  onSearch?: (data: string) => void;
  onChangeSelect?: (value: SelectedItem, name?: string) => void;
  onChangeSearch?: (name?: string) => void;
}

const CSSelectAutoCompile: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const refSelect = useRef(null);
  const {
    valid = true,
    children,
    canUncheck = false,
    onSearch,
    isAlignDropdownEnd,
    isFitContentDropdown = true,
    isResetDropdown,
  } = props;
  const [options, setOptions] = useState<Array<OptionItem>>([]);
  const [isDropOpen, setDropOpen] = useState<boolean>(false);
  const [optSelected, setOptSelected] = useState<SelectedItem>();
  const boundRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLTableElement | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [placeholder, setPlaceholder] = useState(props.placeholder);
  const timeOut = useRef<any>();

  const useOnClickOutside = (ref: any, handler: any) => {
    useEffect(() => {
      const listener = (event: any) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [ref, handler]);
  };

  useOnClickOutside(refSelect, () => {
    setDropOpen(false);
    onSearch && isDropOpen && !optSelected?.value && onSearch("");
  });

  const onToggleOption = (
    value: string,
    event?: MouseEvent<HTMLDivElement>
  ) => {
    if (!canUncheck && value === optSelected?.value) return;
    for (let index = 0; index < options.length; index++) {
      if (options[index].value === value) {
        options[index].selected = !options[index].selected;
      } else {
        options[index].selected = false;
      }
    }
    let onChangeData: any = undefined;
    options.forEach((opt) => {
      if (opt.selected) onChangeData = { title: opt.title, value: opt.value };
    });
    setOptions(Array.from(options));
    setPlaceholder(onChangeData?.title || props.placeholder);
    setOptSelected(onChangeData);
    props.onChangeSelect && props.onChangeSelect(onChangeData);
    props.onClickEvent && event && props.onClickEvent(event);
  };

  const onScroll = (e: UIEvent<HTMLElement>): void => {
    if (props.onScrollContent)
      props.onScrollContent(boundRef.current, contentRef.current, searchValue);
  };

  const onChangeSearch = (value: string) => {
    clearTimeout(timeOut.current);
    setSearchValue(value);

    timeOut.current = window.setTimeout(() => {
      if (value === "" && optSelected?.value) onToggleOption(optSelected.value);
      props.onChangeSearch && props.onChangeSearch(value);
    }, 300);
  };

  const checkPositionDropdown = () => {
    if (props.bottom) {
      return `${style.bottom} ${isAlignDropdownEnd && style.alignEnd} ${
        isFitContentDropdown && style.fitContent
      }`;
    } else {
      return `${style.top} ${isAlignDropdownEnd && style.alignEnd} ${
        isFitContentDropdown && style.fitContent
      }`;
    }
  };

  useEffect(() => {
    const optionElems: Array<OptionItem> = [];
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === "option") {
        const { selected, title, value, children } = child.props;
        const isSelected =
          selected ||
          props.defaultValue === value ||
          optSelected?.value === value;

        optionElems.push({
          title: title ? title : "N/a",
          value: value,
          elem: <div>{children}</div>,
          selected: isSelected,
        });
      }
    });
    setOptions(optionElems);
    // eslint-disable-next-line
  }, [children]);

  useEffect(() => {
    if (isResetDropdown !== undefined) {
      const defaultOptions = options.map((item) => ({
        ...item,
        selected: false,
      }));
      setPlaceholder(props.placeholder);
      setOptions(Array.from(defaultOptions));
      setOptSelected(undefined);
    }
    // eslint-disable-next-line
  }, [isResetDropdown]);

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
        className={`${style.displayAutoCompile} ${
          props.disabled && style.disabled
        } 
        ${props.displayClass}`}
      >
        <input
          placeholder={placeholder || t("field.hint.select")}
          onChange={(e) => onChangeSearch(e.target.value)}
          value={searchValue}
          className={`${!searchValue && style.hint} ${
            style.searchInputAutoCompile
          }`}
          onFocus={() => setDropOpen(true)}
        />
      </div>
      {isDropOpen && (
        <DropDown
          checkPositionDropdown={checkPositionDropdown}
          bottom={props.bottom}
          boundRef={boundRef}
          contentRef={contentRef}
          onScroll={onScroll}
          options={options}
          onToggleOption={onToggleOption}
        />
      )}
      <select
        {...Object.assign({}, props, { iref: undefined, valid: undefined })}
        ref={props.iref}
      >
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

export default CSSelectAutoCompile;
