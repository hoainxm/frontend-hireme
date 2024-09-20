/** @format */

import React, { FC } from "react";

import { DA_ITEMS } from "./constant";
import { DataAnalyticCard } from "../../common/ui/base/card";
import { SectionLayout } from "../../common/ui/layout/section-layout";
import DataAnalyticsBackground from "../../common/ui/assets/images/DataAnalyticsBackground.png";
import style from "./home.module.scss";

interface Props {
  sectionId: string
}

export const DASection: FC<Props> = (props) => {
  const { sectionId } = props

  return (
    <SectionLayout
      id={sectionId}
      title="product.dataAnalytics"
      subTitle="product.dataAnalytics.subTitle"
      backgroundImage={DataAnalyticsBackground}
    >
      <div className={style.gridThreeColumns}>
        {DA_ITEMS.map((item, index) => (
          <DataAnalyticCard key={`${item}_${index}`} content={item} />
        ))}
      </div>
    </SectionLayout>
  );
};