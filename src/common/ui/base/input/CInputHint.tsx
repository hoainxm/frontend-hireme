/** @format */

import React, { FC, LabelHTMLAttributes } from "react";

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {}

const CInputHint: FC<Props> = (props: Props) => {
  return <div className={`${props.className} cihint`}>{props.children}</div>;
};

export default CInputHint;
