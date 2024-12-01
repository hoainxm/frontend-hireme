/** @format */

import { AdminManageTabs, APICloudFeatureTabs, PageName } from '../../../../../models/enum';
import React, { FC } from 'react';
import AdminContentLayout from '../../../../../common/ui/layout/admin-content-layout';
import { RouteComponentProps } from 'react-router-dom';
import { TabItem } from '../../../../../common/ui/layout/model';
import TabLayout from '../../../../../common/ui/layout/tab-layout';
import { useTranslation } from 'react-i18next';
import PermissionListedByAdmin from './PermissionListedByAdmin';

interface Props extends RouteComponentProps<any> {}

const PermissionManagement: FC<Props> = (props: Props) => {
  const { t } = useTranslation();

  const HEADERS: Array<TabItem> = [{ name: AdminManageTabs.PERMISSION, contentId: 'permission' }];

  return (
    <AdminContentLayout dropDefaultContent title={t('admin.permissionManagement')} activate={PageName.ADMIN_MANAGE_PERMISSION}>
      <TabLayout tabs={HEADERS}>
        <PermissionListedByAdmin />
      </TabLayout>
    </AdminContentLayout>
  );
};

export default PermissionManagement;
