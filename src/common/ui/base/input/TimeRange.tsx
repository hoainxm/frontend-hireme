/** @format */

import React, {
  FC,
  InputHTMLAttributes,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Image, Overlay, Popover } from "react-bootstrap";
import style from "./input.module.scss";
import line from "../../assets/ic/16px/line.svg";
import { useForm } from "react-hook-form";
import RedClose from "../../assets/ic/24px/red-close.svg";
import CInput from "./CInput";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  iref?:
    | string
    | ((instance: HTMLInputElement | null) => void)
    | RefObject<HTMLInputElement>;
  name: string;
  disable?: boolean;
  valid?: any;
  sHour?: string | number;
  sMin?: string | number;
  eHour?: string | number;
  eMin?: string | number;
  allowClear?: boolean;
  getData?: (data: any) => void;
}

const TimeRange: FC<Props> = (props: Props) => {
  const {
    sHour = "",
    sMin = "",
    eHour = "",
    eMin = "",
    getData,
    placeholder = "--:-- - --:--",
    allowClear,
  } = props;
  const [show, setShow] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(
    sHour && sMin ? `${sHour}:${sMin}` : null
  );
  const [endTime, setEndTime] = useState<string | null>(
    eHour && eMin ? `${eHour}:${eMin}` : null
  );
  const [target, setTarget] = useState<any>();

  const { getValues, register, setValue } = useForm();
  const refTimeRange = useRef(null);
  const [strHour, setStrHour] = useState<string>("");
  const [strMin, setStrMin] = useState<string>("");
  const [endHour, setEndHour] = useState<string>("");
  const [endMin, setEndMin] = useState<string>("");
  const useOnClickOutside = (ref: any, handler: any) => {
    useEffect(() => {
      const listener = (event: any) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [ref, handler]);
  };

  useOnClickOutside(refTimeRange, () => setShow(false));

  const getValue = () => {
    let shour, ehour, emin, smin;
    shour = getValues("startHour");
    smin = getValues("startMin");
    ehour = getValues("endHour");
    emin = getValues("endMin");

    setStrHour(shour > 23 ? "00" : shour < 0 ? "23" : shour);
    setStrMin(smin > 59 ? "00" : smin < 0 ? "59" : smin);
    setEndHour(ehour > 23 ? "00" : ehour < 0 ? "23" : ehour);
    setEndMin(emin > 59 ? "00" : emin < 0 ? "59" : emin);

    validateHour(shour, "startHour");
    validateMin(smin, "startMin");
    validateHour(ehour, "endHour");
    validateMin(emin, "endMin");

    if (shour > 23 || shour === "") shour = "00";
    else if (shour < 0) shour = "23";
    else if (shour.toString().length === 1) shour = `0${shour}`;

    if (ehour > 23 || ehour === "") ehour = "00";
    else if (ehour < 0) ehour = "23";
    else if (ehour.toString().length === 1) ehour = `0${ehour}`;

    if (smin > 59 || smin === "") smin = "00";
    else if (smin < 0) smin = "59";
    else if (smin.toString().length === 1) smin = `0${smin}`;

    if (emin > 59 || emin === "") emin = "00";
    else if (emin < 0) emin = "59";
    else if (emin.toString().length === 1) emin = `0${emin}`;

    setStartTime(`${shour}:${smin}`);
    setEndTime(`${ehour}:${emin}`);

    getData && getData(shour + ":" + smin + "-" + ehour + ":" + emin);
  };

  const twoCharacterOnly = (id: string) => {
    let element = document.getElementById(id) as HTMLInputElement;
    if (element.value.length > 2) {
      element.value = element.value.slice(0, 2);
    }
  };

  const toggle = (e: React.MouseEvent<HTMLInputElement, MouseEvent>): void => {
    setTarget(e.currentTarget);
    setShow(true);
  };

  const open = () => {
    document.getElementById(props.name)?.click();
  };

  const validateHour = (hour: number, name: string) => {
    if (hour > 23) setValue(name, "00");
    else if (hour < 0) setValue(name, 23);
  };

  const validateMin = (min: number, name: string) => {
    if (min > 59) setValue(name, "00");
    else if (min < 0) setValue(name, 59);
  };

  const doReset = () => {
    setEndHour("");
    setEndMin("");
    setStrHour("");
    setStrMin("");
    setStartTime(null);
    setEndTime(null);
  };

  useEffect(() => {
    let CSHour, CSMin, CEHour, CEMin;
    CSHour = sHour.toString().length === 1 ? `0${sHour}` : sHour;
    CSMin = sMin.toString().length === 1 ? `0${sMin}` : sMin;
    CEHour = eHour.toString().length === 1 ? `0${eHour}` : eHour;
    CEMin = eMin.toString().length === 1 ? `0${eMin}` : eMin;

    if (sHour !== "" && sMin !== "" && eHour !== "" && eMin !== "") {
      setStartTime(`${CSHour}:${CSMin}`);
      setEndTime(`${CEHour}:${CEMin}`);
    }
  }, [sHour, sMin, eHour, eMin]);

  useEffect(() => {
    if (strHour !== "" && strMin !== "" && endHour !== "" && endMin !== "") {
      setValue("startHour", strHour);
      setValue("startMin", strMin);
      setValue("endHour", endHour);
      setValue("endMin", endMin);
    }
    // eslint-disable-next-line
  }, [strHour, strMin, endHour, endMin, show]);

  return (
    <>
      <CInput
        name={props.name}
        className={style.container}
        onClick={(e: React.MouseEvent<HTMLInputElement, MouseEvent>) =>
          toggle(e)
        }
        autoComplete="off"
        placeholder={placeholder}
        disabled={props.disable}
        valid={props.valid}
        value={startTime && endTime ? `${startTime} - ${endTime}` : ""}
      />
      <span className={style.span} onClick={() => open()}>
        {allowClear && startTime && (
          <Image
            width={16}
            height={16}
            src={RedClose}
            className={style.iconCancel}
            onClick={doReset}
          />
        )}
      </span>
      <CInput
        type="hidden"
        name={props.name}
        onChange={() => getValue()}
        value={startTime && endTime ? `${startTime}-${endTime}` : ""}
        disabled={props.disable}
        iref={props.iref}
      />

      <Overlay target={target} show={show} placement="bottom">
        {(props) => (
          <Popover
            id="overlay-example"
            className={style.timeRangeContainer}
            {...props}
          >
            <div ref={refTimeRange} className={"d-flex align-items-center"}>
              <div className={`${style.eachFrm} d-flex align-items-center`}>
                <CInput
                  className={`${style.eInput}`}
                  type="number"
                  name="startHour"
                  id="startHour"
                  iref={register}
                  autoComplete="off"
                  defaultValue={sHour || sHour !== "" ? sHour : "00"}
                  onChange={getValue}
                  onInput={() => twoCharacterOnly("startHour")}
                />
                {":"}
                <CInput
                  className={style.eInput}
                  type="number"
                  name="startMin"
                  id="startMin"
                  defaultValue={sMin || sMin !== "" ? sMin : "00"}
                  iref={register}
                  onChange={getValue}
                  onInput={() => twoCharacterOnly("startMin")}
                />
              </div>

              <Image src={line} alt="" className={style.line} />

              <div className={`${style.eachFrm} d-flex align-items-center`}>
                <CInput
                  className={style.eInput}
                  type="number"
                  name="endHour"
                  id="endHour"
                  defaultValue={eHour || eHour !== "" ? eHour : "00"}
                  iref={register}
                  onChange={getValue}
                  onInput={() => twoCharacterOnly("endHour")}
                />
                {":"}
                <CInput
                  className={style.eInput}
                  type="number"
                  name="endMin"
                  id="endMin"
                  defaultValue={eMin || eMin !== "" ? eMin : "00"}
                  iref={register}
                  onChange={getValue}
                  onInput={() => twoCharacterOnly("endMin")}
                />
              </div>
            </div>
          </Popover>
        )}
      </Overlay>
    </>
  );
};

export default TimeRange;
