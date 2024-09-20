/** @format */

import React, { FC, HTMLAttributes } from "react";

import { Spinner } from "react-bootstrap";
import style from "./loading.module.scss";

interface Props extends HTMLAttributes<HTMLElement> {
  isOpen: boolean;
  zIndex?: number;
  spinnerSize?: number;
  borderWidth?: number;
}

const Loading: FC<Props> = (props: Props) => {
  const { spinnerSize = "76px", borderWidth = "6px" } = props;
  return (
    <div
      className={`${style.loading} ${props.isOpen && style.open}`}
      style={props?.zIndex ? { zIndex: props.zIndex } : undefined}
    >
      <Spinner
        animation="border"
        variant="primary"
        className={props.className}
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderWidth: borderWidth,
        }}
      >
        <span className="sr-only">Loading...</span>
      </Spinner>
      <div className="mt-3"> {props.children}</div>
    </div>
  );
};

export default Loading;
