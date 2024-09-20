/** @format */

import * as icons from "./icon";

import React, { HTMLAttributes, ReactElement } from "react";

import { Palette } from "../../../../models/enum";

export const IconMapName = { ...icons };

interface Props extends HTMLAttributes<SVGElement> {
  icon: keyof typeof IconMapName;
  color?: Palette;
  size?: number;
}

/**
 * SVGIcon Component
 *
 * @param { keyof typeof IconMapName } props.icon Name icon
 * @param { Palette } props.color Color icon
 * @param { number } props.size Size icon
 * @returns { ReactElement } Return component
 */
export const SVGIcon = (props: Props): ReactElement => {
  const { color = Palette.ORIGIN, icon, size } = props;
  const IconComponent = IconMapName[icon];
  return (
    <IconComponent
      width={size}
      height={size}
      {...props}
      className={`${color !== Palette.ORIGIN && color} ` + `${props.className}`}
    />
  );
};
