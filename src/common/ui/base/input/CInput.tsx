/** @format */

import React, {
  FC,
  InputHTMLAttributes,
  RefObject,
  useEffect,
  useState,
} from "react";
import style from "./input.module.scss";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  iref?:
    | string
    | ((instance: HTMLInputElement | null) => void)
    | RefObject<HTMLInputElement>;
  valid?: boolean;
}

const CInput: FC<Props> = (props: Props) => {
  const { valid = true } = props;
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const [unview, setUnview] = useState<boolean>(false);

  const toggleUnview = (): void => setUnview(!unview);

  useEffect(() => {
    setIsPassword(props.type === "password");
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <input
        ref={props.iref}
        {...Object.assign({}, props, { iref: undefined, valid: undefined })}
        className={
          `cinput ` +
          `${props.disabled && style.disable} ` +
          `${valid ? "isvalid" : "isinvalid"} ` +
          `${style.inputContainer} ` +
          `${props.className} ` + 
          `${props.type === "color" && style.colorPicker} ` + 
          `${isPassword && style.pwd}`
        }
        type={unview ? "text" : props.type}
      />
      {isPassword && (
        <span className={unview && style.unview} onClick={toggleUnview} />
      )}
    </>
  );
};

export default CInput;
