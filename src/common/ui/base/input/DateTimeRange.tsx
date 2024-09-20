/** @format */

import React, {
  FC,
  InputHTMLAttributes,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import DateTime from "./DateTime";
import style from "./input.module.scss";
import line from "../../assets/ic/16px/line.svg";
import image from "../../assets/ic/16px/calendar.svg";
import { Overlay, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { dateToString, stringToDate } from "../../../utils/common";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  enableTime?: boolean;
  iref?:
    | string
    | ((instance: HTMLInputElement | null) => void)
    | RefObject<HTMLInputElement>;
  sTimeRef?: React.MutableRefObject<null>;
  eTimeRef?: React.MutableRefObject<null>;
  defaultStart?: string;
  defaultEnd?: string;
  onDataChange?: (startTime: string, endTime: string) => void;
}

const DateTimeRange: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { enableTime, sTimeRef, eTimeRef } = props;
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const endTimeTarget = useRef(null);

  useEffect(() => {
    props.onDataChange && props.onDataChange(startTime, endTime);
    // eslint-disable-next-line
  }, [startTime, endTime]);

  useEffect(() => {
    props.defaultStart && setStartTime(props.defaultStart);
    props.defaultEnd && setEndTime(props.defaultEnd);
    // eslint-disable-next-line
  }, [props.defaultEnd, props.defaultStart]);

  return (
    <div className={`${style.rangeContainer}`}>
      <div className="d-flex ">
        <DateTime
          fpRef={sTimeRef}
          className={style.datetime}
          enableTime={enableTime}
          icon={false}
          onDateChange={(date: Array<Date>) =>
            setStartTime(dateToString(date[0]))
          }
          value={startTime}
        />

        <img src={line} alt="" className={style.line} />

        <div ref={endTimeTarget}>
          <DateTime
            fpRef={eTimeRef}
            className={style.datetime}
            enableTime={enableTime}
            icon={false}
            onDateChange={(date: Array<Date>) =>
              setEndTime(dateToString(date[0]))
            }
            value={endTime}
          />
          {startTime &&
            endTime &&
            stringToDate(startTime) > stringToDate(endTime) && (
              <Overlay
                target={endTimeTarget.current}
                show={true}
                placement="top-end"
              >
                <Tooltip style={{ zIndex: 201 }} id="errorEndTime">
                  {t("error.rangeError")}
                </Tooltip>
              </Overlay>
            )}
        </div>
      </div>
      <input
        type="hidden"
        name="timeRange"
        ref={props.iref}
        value={startTime + "-" + endTime}
      />
      <img src={image} alt="" />
    </div>
  );
};

export default DateTimeRange;
