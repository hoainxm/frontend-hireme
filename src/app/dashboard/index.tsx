/** @format */

import React, { FC } from "react";

import APIKeyManagement from "./management";
import ContentLayout from "../../common/ui/layout/content-layout";
import { PageName } from "../../models/enum";
import { useTranslation } from "react-i18next";

interface Props {}

const Dashboard: FC<Props> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <ContentLayout
      title={t("cloudapi.feature.manage")}
      activate={PageName.HOME}
    >
      <APIKeyManagement isSysAdminSite={false} />
    </ContentLayout>
  );
};

export default Dashboard;
