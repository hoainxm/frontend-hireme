import React, {
  FC,
  InputHTMLAttributes,
  RefObject,
  useEffect,
  useState,
} from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import icon from "../../assets/ic/16px/clock.svg";
import style from "./input.module.scss";
import { Image } from "react-bootstrap";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  iref?:
    | string
    | ((instance: HTMLInputElement | null) => void)
    | RefObject<HTMLInputElement>;
  valid?: boolean;
}

const Time: FC<Props> = (props: Props) => {
  const { valid = true, iref } = props;
  const [value, setValue] = useState<Date>();

  useEffect(() => {
    if (props.value) {
      const timeValue = (props.value + "").split(":");
      const time = new Date();
      time.setHours(parseInt(timeValue[0]));
      time.setMinutes(parseInt(timeValue[1]));
      setValue(time);
    }
  }, [props.value]);

  useEffect(() => {
    if (props.defaultValue) {
      const timeValue = (props.defaultValue + "").split(":");
      const time = new Date();
      time.setHours(parseInt(timeValue[0]));
      time.setMinutes(parseInt(timeValue[1]));
      setValue(time);
    }
  }, [props.defaultValue]);

  return (
    <div
      className={
        `${props.disabled && style.disable} ` +
        `${valid ? "isvalid" : "isinvalid"} ` +
        `${style.inputContainer} ${props.className} ` +
        `position-relative cinput`
      }
    >
      <Flatpickr
        disabled={props.disabled}
        readOnly={props.readOnly}
        value={value}
        onChange={(d) => setValue(d[0])}
        options={{
          enableTime: true,
          dateFormat: "H:i",
          noCalendar: true,
          time_24hr: true,
          disableMobile: true
        }}
      />
      <Image className={style.icon} src={icon} />
      <input
        style={{ display: "none" }}
        type="text"
        {...props}
        ref={iref}
        value={value ? `${value.getHours()}:${value.getMinutes()}` : undefined}
      />
    </div>
  );
};

export default Time;
