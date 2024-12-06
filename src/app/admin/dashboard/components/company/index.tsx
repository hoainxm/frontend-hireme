/** @format */

import { AdminManageTabs, APICloudFeatureTabs, PageName } from '../../../../../models/enum';
import React, { FC } from 'react';
import AdminContentLayout from '../../../../../common/ui/layout/admin-content-layout';
import { RouteComponentProps } from 'react-router-dom';
import { TabItem } from '../../../../../common/ui/layout/model';
import TabLayout from '../../../../../common/ui/layout/tab-layout';
import { useTranslation } from 'react-i18next';
import CompanyListedByAdmin from './CompanyListedByAdmin';
import CompanyStatistics from './CompanyStatistics';

interface Props extends RouteComponentProps<any> {}

const CompanyManagement: FC<Props> = (props: Props) => {
  const { t } = useTranslation();

  const HEADERS: Array<TabItem> = [
    { name: AdminManageTabs.COMPANY, contentId: 'company' },
    { name: AdminManageTabs.STATISTICAL, contentId: 'statistics' },
  ];

  return (
    <AdminContentLayout dropDefaultContent title={t('admin.companyManagement')} activate={PageName.ADMIN_DASHBOARD}>
      <TabLayout tabs={HEADERS}>
        <CompanyListedByAdmin key={0} id='company' />
        <CompanyStatistics key={1} id='statistics' />
      </TabLayout>
    </AdminContentLayout>
  );
};

export default CompanyManagement;
