/** @format */

import React, { FC, RefObject } from "react";
import { useTranslation } from "react-i18next";
import { Form, Row, Col } from "react-bootstrap";
import { CInput, CInputHint } from "../../../common/ui/base";
import style from "./welcomeInform.module.scss";
import {
  EMAIL_PATTERN,
  PHONE_DETAIL_PATTERN,
} from "../../../common/utils/constants";
import { EditWelcomeInformForm } from "../form";
import { DeepMap, FieldError, RegisterOptions } from "react-hook-form";

interface Props {
  register: (registerOptions: RegisterOptions) => any;
  isEdit: boolean;
  setColor: (color: string) => void;
  color: string;
  errors: DeepMap<EditWelcomeInformForm, FieldError>;
  initial?: EditWelcomeInformForm;
}

const EditWelcomeInform: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { register, isEdit, color, setColor, errors, initial } = props;

  return (
    <>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>{t("welcome.field.title")}</Form.Label>
            <CInput
              name="primary_name"
              iref={register({})}
              disabled={!isEdit}
              defaultValue={initial?.primary_name}
              placeholder={t("welcome.hint.title")}
            ></CInput>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group>
            <Form.Label>{t("hr.staff.address")}</Form.Label>
            <CInput
              name="address"
              iref={register({})}
              disabled={!isEdit}
              defaultValue={initial?.address}
              placeholder={t("hr.staff.hint.address")}
            ></CInput>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group>
            <Form.Label>{t("field.email")}</Form.Label>
            <CInput
              name="email"
              iref={register({
                required: "field.error.required",
                pattern: EMAIL_PATTERN,
              })}
              defaultValue={initial?.email}
              disabled={!isEdit}
              placeholder={t("field.hint.email")}
              valid={!errors.email}
            />
            {errors.email?.type === "pattern" && (
              <CInputHint>{t("field.error.email")}</CInputHint>
            )}
            {errors.email?.type === "required" && (
              <CInputHint className={style.red}>
                {t(`${errors.email.message}`)}
              </CInputHint>
            )}
          </Form.Group>
        </Col>

        <Col>
          <Form.Group>
            <Form.Label>{t("support.phone")}</Form.Label>
            <CInput
              name="phone_detail"
              iref={register({
                pattern: PHONE_DETAIL_PATTERN,
              })}
              valid={!errors.phone_detail}
              disabled={!isEdit}
              placeholder={t("field.hint.phone")}
              defaultValue={initial?.phone_detail}
            />
            {errors.phone_detail?.type === "pattern" && (
              <CInputHint className={style.red}>
                {t("field.error.phoneNumber")}
              </CInputHint>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Form.Group>
            <Form.Label>{t("welcome.background")}</Form.Label>
            <div className="d-flex ">
              <CInput
                className={`p-1 mr-3 ${style.colorPicker}`}
                type="color"
                name="background"
                iref={register({})}
                disabled={!isEdit}
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <CInput
                name="backgroundHint"
                disabled
                value={color}
                className={style.colorPickerHint}
              />
            </div>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default EditWelcomeInform;
