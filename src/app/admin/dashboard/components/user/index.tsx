/** @format */

import { AdminManageTabs, APICloudFeatureTabs, PageName } from '../../../../../models/enum';
import React, { FC } from 'react';
import AdminContentLayout from '../../../../../common/ui/layout/admin-content-layout';
import { RouteComponentProps } from 'react-router-dom';
import { TabItem } from '../../../../../common/ui/layout/model';
import TabLayout from '../../../../../common/ui/layout/tab-layout';
import { useTranslation } from 'react-i18next';
import UserListedByAdmin from './UserListedByAdmin';

interface Props extends RouteComponentProps<any> {}

const UserManagement: FC<Props> = (props: Props) => {
  const { t } = useTranslation();

  const HEADERS: Array<TabItem> = [
    { name: AdminManageTabs.USER, contentId: 'user' },
    { name: AdminManageTabs.COMPANY, contentId: 'company' },
    { name: AdminManageTabs.JOBS, contentId: 'job' },
    { name: AdminManageTabs.CV, contentId: 'cv' },
  ];

  return (
    <AdminContentLayout dropDefaultContent title={t('admin.userManagement')} activate={PageName.ADMIN_DASHBOARD}>
      <TabLayout tabs={HEADERS}>
        <UserListedByAdmin key={0} id='user' />
      </TabLayout>
    </AdminContentLayout>
  );
};

export default UserManagement;
