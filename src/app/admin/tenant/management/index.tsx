/** @format */

import {
  BlankFrame,
  CTPaging,
  CTRow,
  CTable,
} from "../../../../common/ui/base";
import React, { FC, useEffect, useState } from "react";

import { APIResponse } from "../../../../common/utils/baseAPI";
import AdminContentLayout from "../../../../common/ui/layout/admin-content-layout";
import { Image } from "react-bootstrap";
import { NOT_SET } from "../../../../common/utils/constants";
import NotData from "../../../../common/ui/assets/ic/100px/no-data.svg";
import { PageName } from "../../../../models/enum";
import { RouteComponentProps } from "react-router-dom";
import { TenantInfo } from "../../../dashboard/model";
import { getTenantAPI } from "../../../dashboard/api";
import { useTranslation } from "react-i18next";

interface Props extends RouteComponentProps {}

const Tenant: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [tenants, setTenant] = useState<Array<TenantInfo>>([]);

  const TABLE_HEADER = [
    t("tenant.name"),
    t("tenant.alias"),
    t("field.logoTenant"),
  ];

  const getTenants = (page: number) => {
    getTenantAPI(page).then((res) => {
      const data: APIResponse<TenantInfo> = res.data;
      setTenant(data.results);
      setCurrentPage(data.page);
      setTotalPage(Math.ceil(data.total / data.page_size));
    });
  };

  useEffect(() => {
    getTenants(1);
    // eslint-disable-next-line
  }, []);

  return (
    <AdminContentLayout
      title={t("admin.tenant.tenantManagement")}
      activate={PageName.TENANT_MANAGEMENT}
    >
      <CTable responsive maxHeight={833}>
        <thead>
          <CTRow header data={TABLE_HEADER} />
        </thead>
        <tbody>
          {tenants.map((item, index) => (
            <CTRow
              key={index}
              data={[
                item.name,
                item.alias,
                item.logo ? (
                  <Image width="30" height="30" src={item.logo} />
                ) : (
                  NOT_SET
                ),
              ]}
            />
          ))}
        </tbody>
      </CTable>
      {tenants?.length > 0 ? (
        <div className="d-flex justify-content-end">
          <CTPaging
            className="mt-4"
            currentPage={currentPage}
            totalPage={totalPage}
            onGetData={getTenants}
          />
        </div>
      ) : (
        <div className="imageNoData">
          <BlankFrame image={NotData} title={t("field.hint.no_data")} />
        </div>
      )}
    </AdminContentLayout>
  );
};

export default Tenant;
