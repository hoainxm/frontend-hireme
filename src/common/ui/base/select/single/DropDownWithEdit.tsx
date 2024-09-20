/** @format */

import React, {
  FC,
  SelectHTMLAttributes,
  useRef,
  MouseEvent,
  UIEvent,
} from "react";
import { Image } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { OptionItem, SelectedItem } from "../../model";
import style from "../select.module.scss";
import Check from "../../../assets/ic/16px/check.svg";
import Close from "../../../assets/ic/16px/red-close.svg";
import { CInput } from "../../input";
import CButton from "../../button";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  bottom?: boolean;
  subName?: string;
  subPlaceholder?: string;
  boundRef: React.MutableRefObject<HTMLDivElement | null>;
  onScroll: (e: UIEvent<HTMLElement>) => void;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  options: Array<OptionItem>;
  onToggleOption: (value: string, e: MouseEvent<HTMLDivElement>) => void;
  isEdited: boolean;
  setIsEdited: (value: boolean) => void;
  setOptSelected: (value: SelectedItem) => void;
  onChangeSelect?: (value: SelectedItem, name?: string) => void;
  setExtraOption: (value: OptionItem) => void;
  checkPositionDropdown: () => string;
}

const DropDownWithEdit: FC<Props> = (props: Props) => {
  const {
    boundRef,
    contentRef,
    onScroll,
    options,
    onToggleOption,
    isEdited,
    setIsEdited,
    setOptSelected,
    setExtraOption,
  } = props;
  const { t } = useTranslation();
  const subInputRef = useRef<any>(null);

  const addNewItem = () => {
    const subValue: string = subInputRef.current.value;

    let selectedData: any = undefined;
    selectedData = { title: subValue, value: subValue };
    setOptSelected(selectedData);
    setExtraOption(selectedData);
    setIsEdited(false);
  };

  const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" && addNewItem();
  };

  return (
    <div className={props.checkPositionDropdown()}>
      <div className={style.dropdown}>
        <div
          className={style.dropdownContentWithButton}
          ref={boundRef}
          onScroll={onScroll}
        >
          <div ref={contentRef}>
            {options.map((option, index) => (
              <div
                key={index}
                className={style.optionItem}
                onClick={(e) => onToggleOption(option.value, e)}
              >
                <div className={style.optionName}>{option.elem}</div>
              </div>
            ))}
            {!options.length && (
              <div className={style.noData}>{t("field.data.noData")}</div>
            )}
          </div>
        </div>
      </div>
      {!isEdited && (
        <div className={style.blueButton} onClick={() => setIsEdited(true)}>
          {`+ ${t("btn.new")}`}
        </div>
      )}
      {isEdited && (
        <div className={style.inputContainer}>
          <CInput
            iref={subInputRef}
            className={style.input}
            name={props.subName}
            placeholder={t(`${props.subPlaceholder}`)}
            id={props.subName}
            onKeyPress={(e) => handlePressEnter(e)}
          />
          <div className={style.button}>
            <CButton
              borderless
              onClick={(event) => {
                setIsEdited(false);
                event.preventDefault();
              }}
            >
              <Image src={Close} />
            </CButton>
            <CButton
              borderless
              onClick={(event) => {
                addNewItem();
                event.preventDefault();
              }}
            >
              <Image src={Check} />
            </CButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDownWithEdit;
