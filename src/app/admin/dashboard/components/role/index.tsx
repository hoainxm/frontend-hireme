/** @format */

import { AdminManageTabs, APICloudFeatureTabs, PageName } from '../../../../../models/enum';
import React, { FC } from 'react';
import AdminContentLayout from '../../../../../common/ui/layout/admin-content-layout';
import { RouteComponentProps } from 'react-router-dom';
import { TabItem } from '../../../../../common/ui/layout/model';
import TabLayout from '../../../../../common/ui/layout/tab-layout';
import { useTranslation } from 'react-i18next';
import RoleListedByAdmin from './RoleListedByAdmin';

interface Props extends RouteComponentProps<any> {}

const RoleManagement: FC<Props> = (props: Props) => {
  const { t } = useTranslation();

  const HEADERS: Array<TabItem> = [{ name: AdminManageTabs.ROLE, contentId: 'role' }];

  return (
    <AdminContentLayout dropDefaultContent title={t('admin.roleManagement')} activate={PageName.ADMIN_MANAGE_ROLE}>
      <TabLayout tabs={HEADERS}>
        <RoleListedByAdmin id='role' key={0} />
      </TabLayout>
    </AdminContentLayout>
  );
};

export default RoleManagement;
