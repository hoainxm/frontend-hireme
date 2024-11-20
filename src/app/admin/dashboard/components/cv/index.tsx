/** @format */

import { AdminManageTabs, APICloudFeatureTabs, PageName } from '../../../../../models/enum';
import React, { FC } from 'react';
import AdminContentLayout from '../../../../../common/ui/layout/admin-content-layout';
import { RouteComponentProps } from 'react-router-dom';
import { TabItem } from '../../../../../common/ui/layout/model';
import TabLayout from '../../../../../common/ui/layout/tab-layout';
import { useTranslation } from 'react-i18next';
import CVListedByAdmin from './CVListedByAdmin';

interface Props extends RouteComponentProps<any> {}

const CVManagement: FC<Props> = (props: Props) => {
  const { t } = useTranslation();

  const HEADERS: Array<TabItem> = [{ name: AdminManageTabs.CV, contentId: 'cv' }];

  return (
    <AdminContentLayout dropDefaultContent title={t('admin.cvManagement')} activate={PageName.ADMIN_DASHBOARD}>
      <TabLayout tabs={HEADERS}>
        <CVListedByAdmin key={0} id='cv' />
      </TabLayout>
    </AdminContentLayout>
  );
};

export default CVManagement;
