/** @format */

import React, { FC, HTMLAttributes, RefObject, useState, useEffect, useRef } from 'react';
import style from './search.module.scss';
import { Image } from 'react-bootstrap';
import Search from '@icon/Search.svg';
import Clear from '@icon/ClearText.svg';
import { KeyboardEvent } from 'react';

interface Props extends HTMLAttributes<HTMLInputElement> {
  onSearch: (data: string) => void;
  doReset?: (data: string) => void;
  name?: string;
  iref?: string | ((instance: HTMLInputElement | null) => void) | RefObject<HTMLInputElement>;
  valid?: boolean;
  placeholder?: string;
  searchValueListener?: string;
  autoComplete?: string;
  // doClickOutSide?: (searchValue: string)=> void;
}

const SearchBar: FC<Props> = (props: Props) => {
  const { placeholder, name = 'search', searchValueListener = '', autoComplete } = props;
  const [searchValue, setSearchValue] = useState<string>('');
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [canResetSearch, setCanResetSearch] = useState(false);
  const prevSearchValue = useRef<string>('');
  // const refElement = useRef(null);

  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      prevSearchValue.current = e.currentTarget.value;
      props.onSearch && props.onSearch(e.currentTarget.value);
    }
  };

  const onSearch = () => {
    if (prevSearchValue.current === searchValue) return;
    prevSearchValue.current = searchValue;
    props.onSearch && props.onSearch(searchValue);
  };

  const cancelImage = (
    <Image
      width={16}
      height={16}
      src={Clear}
      className={style.icon}
      onClick={() => {
        setCanResetSearch(true);
        setSearchValue('');
        prevSearchValue.current = '';
        props.doReset && props.doReset('');
      }}
    />
  );

  // const useOnClickOutside = (ref: any, handler: any) => {
  //   useEffect(() => {
  //     const listener = (event: any) => {
  //       // Do nothing if clicking ref's element or descendent elements
  //       if (!ref.current || ref.current.contains(event.target)) {
  //         return;
  //       }
  //       handler(event);
  //     };
  //     document.addEventListener("mousedown", listener);
  //     document.addEventListener("touchstart", listener);
  //     return () => {
  //       document.removeEventListener("mousedown", listener);
  //       document.removeEventListener("touchstart", listener);
  //     };
  //   }, [ref, handler]);
  // };

  // useOnClickOutside(refElement, () => {
  //   props.doClickOutSide && props.doClickOutSide(searchValue)
  // });

  useEffect(() => {
    searchValue.length > 0 ? setIsSearch(true) : setIsSearch(false);
    if (canResetSearch && !searchValue) {
      props.onSearch && props.onSearch('');
      setCanResetSearch(false);
    }
    // eslint-disable-next-line
  }, [searchValue, canResetSearch]);

  useEffect(() => {
    setSearchValue(searchValueListener);
    prevSearchValue.current = searchValueListener;
    // eslint-disable-next-line
  }, [searchValueListener]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length > 0) {
      setSearchValue(e.currentTarget.value);
    } else {
      setSearchValue(e.currentTarget.value);
      prevSearchValue.current !== e.currentTarget.value && props.onSearch && props.onSearch('');
      prevSearchValue.current = e.currentTarget.value;
    }
  };

  return (
    <div {...props} className={`${style.searchBar} ${props.className}`}>
      <Image src={Search} className={style.icon} onClick={onSearch} />
      <input
        name={name}
        ref={props.iref}
        {...Object.assign({}, props, { iref: undefined, valid: undefined })}
        className={style.search}
        placeholder={placeholder}
        onKeyPress={onKeyPress}
        onChange={(e) => handleChangeInput(e)}
        value={searchValue}
        autoComplete={autoComplete ? autoComplete : ''}
      />
      {isSearch && cancelImage}
    </div>
  );
};
export default SearchBar;
