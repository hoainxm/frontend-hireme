import React, {
  FC,
  HTMLAttributes,
  RefObject,
  useState,
  useRef,
  useEffect,
} from "react";
import style from "./search.module.scss";
import { Image } from "react-bootstrap";
import icon from "../../assets/ic/16px/magnifiying-glass.svg";
import { useTranslation } from "react-i18next";
import { KeyboardEvent } from "react";

interface Props extends HTMLAttributes<HTMLInputElement> {
  onSearch: (data: string) => void;
  name?: string;
  iref?:
    | string
    | ((instance: HTMLInputElement | null) => void)
    | RefObject<HTMLInputElement>;
  valid?: boolean;
  dataSearch: any;
  setNameSearch: (value: string) => void;
  keyExtract?: string;
}

const SearchAutoComplete: FC<Props> = (props: Props) => {
  const { keyExtract = "name" } = props;
  const { t } = useTranslation();
  const wrapperRef = useRef<any>(null);

  const {
    placeholder = t("field.search"),
    name = "search",
    dataSearch,
    setNameSearch,
  } = props;

  const [display, setDisplay] = useState<boolean>(false);
  const [options, setOptions] = useState<Array<any>>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const array: Array<any> = [];
    dataSearch &&
      dataSearch.forEach((item: any) => {
        array.push({ name: item[keyExtract] });
      });
    setOptions(array);
    // eslint-disable-next-line
  }, [dataSearch]);

  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      props.onSearch(e.currentTarget.value);
      setDisplay(false);
    }
  };

  const updateNameSearch = (name: string) => {
    props.onSearch(name);
    setSearch(name);
    setDisplay(false);
  };

  const handleChange = (event: any) => {
    setNameSearch(event.target.value);
    setSearch(event.target.value);
    event.target.value !== "" ? setDisplay(true) : setDisplay(false);
  };

  const renderHighlightText = (value: string) => {
    if (search) {
      let idx = value.toLowerCase().indexOf(search.toLowerCase());
      let newText = [
        value.substring(0, idx),
        <span className={style.highlightText}>
          {value.substring(idx, idx + search.length)}
        </span>,
        value.substring(idx + search.length),
      ];
      return <span>{newText}</span>;
    }
  };

  const renderOption = () => {
    let sliceSameName: Array<string> = [];
    // eslint-disable-next-line
    options.map((item) => {
      sliceSameName.push(item.name);
    });
    // unique string in an array
    let unique = sliceSameName.filter((elem, index, self) => {
      return index === self.indexOf(elem);
    });
    const newOption = unique.filter(
      (item) => item && item.toLowerCase().indexOf(search.toLowerCase()) > -1
    );
    if (search && newOption.length > 0) {
      return (
        <div className={style.autoContainer}>
          {search &&
            newOption.map((value, i) => {
              return (
                <div
                  onClick={() => updateNameSearch(value)}
                  className={style.option}
                  key={i}
                  tabIndex={0}
                >
                  {renderHighlightText(value)}
                </div>
              );
            })}
        </div>
      );
    }
  };

  return (
    <div ref={wrapperRef} className={`${style.autoSearchBar} ${props.className}`}>
      <div className="d-flex align-items-center w-100">
        <Image src={icon} className={style.icon} />
        <input
          autoComplete="off"
          name={name}
          className={style.search}
          placeholder={placeholder}
          onKeyPress={onKeyPress}
          id="autocomplete"
          value={search}
          onChange={(event) => handleChange(event)}
        />
      </div>
      {display && renderOption()}
    </div>
  );
};
export default SearchAutoComplete;
