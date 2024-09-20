import React, { ChangeEvent, FC, RefObject, SelectHTMLAttributes, useState } from 'react';
import style from '../../input/input.module.scss';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  iref?: string | ((instance: HTMLSelectElement | null) => void) | RefObject<HTMLSelectElement>;
  valid?: boolean;
  placeholder?: string;
}

const CSelect: FC<Props> = (props: Props) => {
  const { valid = true, placeholder } = props;

  const [value, setValue] = useState('');

  const selectPlaceholder = (
    <select
      {...Object.assign({}, props, { iref: undefined, valid: undefined })}
      className={`${props.disabled && style.disable} ` + `${valid ? 'isvalid' : 'isinvalid'} ` + `${style.inputContainer} ${props.className} cinput`}
      ref={props.iref}
      onChange={(event: ChangeEvent<HTMLSelectElement>) => {
        setValue(event.target.value);
        props.onChange && props.onChange(event);
      }}
      style={{ opacity: value && value !== 'all' ? '' : '0.7' }}
    >
      <option className='d-none' value=''>
        {placeholder}
      </option>
      {props.children}
    </select>
  );

  const selectDefault = (
    <select
      {...Object.assign({}, props, { iref: undefined, valid: undefined })}
      className={`${props.disabled && style.disable} ` + `${valid ? 'isvalid' : 'isinvalid'} ` + `${style.inputContainer} ${props.className} cinput`}
      ref={props.iref}
    >
      {props.children}
    </select>
  );

  return placeholder ? selectPlaceholder : selectDefault;
};

export default CSelect;
