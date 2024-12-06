/** @format */

import { AdminManageTabs, APICloudFeatureTabs, PageName } from '../../../../../models/enum';
import React, { FC } from 'react';
import AdminContentLayout from '../../../../../common/ui/layout/admin-content-layout';
import { RouteComponentProps } from 'react-router-dom';
import { TabItem } from '../../../../../common/ui/layout/model';
import TabLayout from '../../../../../common/ui/layout/tab-layout';
import { useTranslation } from 'react-i18next';
import UserListedByAdmin from './UserListedByAdmin';
import UserStatistical from './UserStatistics';

interface Props extends RouteComponentProps<any> {}

const UserManagement: FC<Props> = (props: Props) => {
  const { t } = useTranslation();

  const HEADERS: Array<TabItem> = [
    { name: AdminManageTabs.USER, contentId: 'user' },
    { name: AdminManageTabs.STATISTICAL, contentId: 'statistics' },
  ];

  return (
    <AdminContentLayout dropDefaultContent title={t('admin.userManagement')} activate={PageName.ADMIN_DASHBOARD}>
      <TabLayout tabs={HEADERS}>
        <UserListedByAdmin key={0} id='user' />
        <UserStatistical key={1} id='statistics' />
      </TabLayout>
    </AdminContentLayout>
  );
};

export default UserManagement;
