/** @format */

import React, {
  FC,
  InputHTMLAttributes,
  RefObject,
  useEffect,
  useState,
} from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import calendarIcon from "../../assets/ic/16px/calendar.svg";
import style from "./input.module.scss";
import { Image } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { DAY_OF_WEEK, MONTHS } from "../../../utils/constants";
import { dateToString } from "../../../utils/common";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  format?: string;
  enableTime?: boolean;
  icon?: boolean;
  onDateChange?: (date: Array<Date>) => void;
  defaultValue?: string;
  iref?:
    | string
    | ((instance: HTMLInputElement | null) => void)
    | RefObject<HTMLInputElement>;
  fpRef: any;
  value?: string;
  name?: string;
  valid?: boolean;
  fpStatic?: boolean;
  flatpickrClass?: string;
}

const DateTime: FC<Props> = (props: Props) => {
  const {
    valid = true,
    value,
    className,
    icon = true,
    disabled,
    readOnly,
    enableTime = true,
    format = enableTime ? "m/d/Y H:i" : "m/d/Y",
    placeholder = enableTime ? "MM/DD/YYYY 00:00" : "MM/DD/YYYY",
    defaultValue,
  } = props;
  const { t } = useTranslation();
  const months = MONTHS.map((value) => t(value)) as typeof MONTHS;
  const weekDay = DAY_OF_WEEK.map((value) => t(value)) as typeof DAY_OF_WEEK;

  const doOpen = () => {
    setTimeout(() => {
      props.fpRef && props.fpRef.current?.flatpickr.open();
    }, 100);
  };

  const [dateValue, setValue] = useState<string>();
  const getData = (data: Array<Date>) => {
    setValue(enableTime ? dateToString(data[0]) : dateToString(data[0], false));
    props.onDateChange && props.onDateChange(data);
  };

  useEffect(() => {
    if (value) setValue(dateToString(new Date(value), enableTime));
    else if (defaultValue)
      setValue(dateToString(new Date(defaultValue), enableTime));
    else setValue(undefined);
    // eslint-disable-next-line
  }, [value]);

  const defaultClass = valid
    ? `${style.valueContainer} flex-base-between ${className} datetime`
    : `${style.valueContainer} ${style.borderRed} flex-base-between ${className} datetime`;
  const disableClass = `${style.valueContainer} ${style.disabled} flex-base-between ${className} datetime`;

  return (
    <div
      onClick={doOpen}
      className={`${disabled ? disableClass : defaultClass} ${
        style.wrapperInput
      }`}
    >
      <Flatpickr
        className={`${style.dateTime} ${props.flatpickrClass}`}
        ref={props.fpRef}
        value={value || defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={true}
        name={props.name}
        options={{
          static: props.fpStatic,
          minuteIncrement: 1,
          enableTime: enableTime,
          dateFormat: format,
          time_24hr: true,
          locale: {
            firstDayOfWeek: 1,
            weekdays: {
              shorthand: weekDay,
              longhand: weekDay,
            },
            months: {
              shorthand: months,
              longhand: months,
            },
          },
          disableMobile: true,
        }}
        onChange={(data) => getData(data)}
      />
      <input
        name={props.name}
        type="hidden"
        value={dateValue || defaultValue}
        ref={props.iref}
        className={valid ? "isvalid" : "isinvalid"}
      />
      {icon ? <Image src={calendarIcon} /> : ""}
    </div>
  );
};

export default DateTime;
