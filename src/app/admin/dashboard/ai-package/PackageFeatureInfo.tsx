/** @format */

import { AIFeatureItem, AIFeaturePackage } from "../../../dashboard/model";
import {
  AI_FEATURE_TRANSLATE,
  LIMIT_TYPE_TRANSLATE,
  NORMAL_NUMBER_PATTERN,
} from "../../../../common/utils/constants";
import { CInput, CInputHint } from "../../../../common/ui/base";
import { Col, Form, Image, Row } from "react-bootstrap";
import { DeepMap, FieldError, RegisterOptions } from "react-hook-form";
import React, { FC, useState } from "react";

import { CSSelect } from "@base/select";
import { PackageForm } from "../../../dashboard/form";
import { RequestLimitType } from "../../../../models/enum";
import TrashCanIcon from "../../../../common/ui/assets/ic/20px/trash-bin.svg";
import style from "../cloudFeature.module.scss";
import { useTranslation } from "react-i18next";

interface Props {
  isEdit: boolean;
  position: number;
  packageFeature: AIFeatureItem;
  errors: DeepMap<PackageForm, FieldError>;
  aiFeatures: Array<AIFeaturePackage>;
  isLastItem: boolean;
  removeFeature(): void;
  clearErrors: (value: string) => void;
  unregister: (value: string) => void;
  register: (registerOptions: RegisterOptions) => any;
  checkDuplicated: (alFeatureItem: AIFeatureItem, position: number) => boolean;
}

const PackageFeatureInfo: FC<Props> = (props: Props) => {
  const { isEdit, position, errors, packageFeature, aiFeatures, register } =
    props;
  const { t } = useTranslation();
  const [isLimit, setIsLimit] = useState<boolean>(!!packageFeature.isLimit);

  const handleCheckLimit = (value: boolean) => {
    if (!value) {
      props.clearErrors(`features.${position}.request_limit`);
      props.unregister(`features.${position}.request_limit`);
    }
    if (!packageFeature.limit_type)
      packageFeature.limit_type = RequestLimitType.REQUEST;
    packageFeature.isLimit = value;
    setIsLimit(value);
  };

  return (
    <div className={`${style.packageFeatureInfo} flex-sm-column flex-md-row`}>
      <Row>
        <Col sm="6">
          <Form.Group>
            <Form.Label className="required">
              {t("field.featureType")}
            </Form.Label>
            <CSSelect
              name={`features.${position}.ai_feature`}
              disabled={!isEdit}
              iref={register({
                required: "field.error.required",
                validate: () =>
                  !props.checkDuplicated(packageFeature, position),
              })}
              valid={
                !(
                  errors.features &&
                  errors.features[position] &&
                  errors.features[position]?.ai_feature
                ) && !packageFeature.isDuplicated
              }
              defaultValue={packageFeature.ai_feature || undefined}
              onChangeSelect={(data) =>
                (packageFeature.ai_feature = parseInt(data?.value))
              }
              canUncheck={false}
              bottom={props.isLastItem}
            >
              {aiFeatures.map((packageFeature, position) => (
                <option
                  key={position}
                  title={t(AI_FEATURE_TRANSLATE[packageFeature.name])}
                  value={packageFeature.id}
                >
                  {t(AI_FEATURE_TRANSLATE[packageFeature.name])}
                </option>
              ))}
            </CSSelect>
            {errors.features &&
              errors.features[position] &&
              errors.features[position]?.ai_feature && (
                <CInputHint>
                  {t(
                    `${
                      errors.features &&
                      errors.features[position] &&
                      errors.features[position]?.ai_feature?.message
                    }`
                  )}
                </CInputHint>
              )}
            {packageFeature.isDuplicated && (
              <CInputHint className="validated">
                {t("error.featureDuplicated")}
              </CInputHint>
            )}
          </Form.Group>
        </Col>
        <Col sm="6">
          <Form.Group>
            <Form.Label className="required">
              {t("aipackage.requestNum")}
            </Form.Label>
            <CInput
              // type="number"
              name={`features.${position}.request_limit`}
              defaultValue={packageFeature.request_limit || undefined}
              disabled={!isEdit || !isLimit}
              placeholder={t("aipackage.hint.requestNum")}
              onChange={(e) =>
                (packageFeature.request_limit = parseInt(e.currentTarget.value))
              }
              valid={
                !(
                  errors.features &&
                  errors.features[position] &&
                  errors.features[position]?.request_limit
                )
              }
              iref={
                isEdit && isLimit
                  ? register({
                      required: "field.error.required",
                      min: 1,
                      max: 10000,
                      pattern: NORMAL_NUMBER_PATTERN,
                    })
                  : undefined
              }
            />
            {errors.features &&
              errors.features[position] &&
              errors?.features[position]?.request_limit?.type ===
                "required" && (
                <CInputHint>{t("field.error.required")}</CInputHint>
              )}
            {errors.features &&
              errors.features[position] &&
              errors?.features[position]?.request_limit?.type === "min" && (
                <CInputHint>{`${t("field.error.min")} 1`}</CInputHint>
              )}
            {errors.features &&
              errors.features[position] &&
              errors?.features[position]?.request_limit?.type === "max" && (
                <CInputHint>{`${t("field.error.max")} 10000`}</CInputHint>
              )}
            {errors.features &&
              errors.features[position] &&
              errors?.features[position]?.request_limit?.type === "pattern" && (
                <CInputHint>{`${t("field.error.numberOnly")}`}</CInputHint>
              )}
          </Form.Group>
        </Col>
      </Row>
      <Row className="ml-md-3">
        <Col sm="6" md="5">
          <Form.Group>
            <Form.Label>{t("field.limitType")}</Form.Label>
            <CSSelect
              name={`features.${position}.limit_type`}
              disabled={!isEdit || !isLimit}
              iref={register({})}
              defaultValue={
                packageFeature.request_limit
                  ? packageFeature.limit_type
                  : RequestLimitType.REQUEST
              }
              onChangeSelect={(data) =>
                (packageFeature.limit_type = parseInt(data.value))
              }
              canUncheck={false}
            >
              {Object.entries(LIMIT_TYPE_TRANSLATE).map(
                ([key, value], index) => (
                  <option key={index} title={t(value)} value={parseInt(key)}>
                    {t(value)}
                  </option>
                )
              )}
            </CSSelect>
          </Form.Group>
        </Col>
        <Col sm="4" md="5" className="d-flex align-items-start mt-4">
          <Form.Group>
            <Form.Check
              custom
              type="checkbox"
              label={t("field.limitNumUsed")}
              id={position.toString()}
              checked={isLimit}
              disabled={!isEdit}
              onChange={(e) => handleCheckLimit(e.currentTarget.checked)}
            />
          </Form.Group>
        </Col>
        {isEdit && (
          <Col sm="2" className="d-flex align-items-start mt-4">
            <Image src={TrashCanIcon} onClick={props.removeFeature} />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default PackageFeatureInfo;
