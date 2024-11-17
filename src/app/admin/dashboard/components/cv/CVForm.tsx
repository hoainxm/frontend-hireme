/** @format */

import React, { FC, useState, useEffect } from 'react';
import AdminContentLayout from '../../../../../common/ui/layout/admin-content-layout';
import TabLayout from '../../../../../common/ui/layout/tab-layout';
import { TabItem } from '../../../../../common/ui/layout/model';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { createData, fetchData, updateData } from '../../api';
import { PageName } from '../../../../../models/enum';

const CVForm: FC = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState('');
  const { id } = useParams<{ id?: string }>();

  const HEADERS: Array<TabItem> = [
    { name: t('cv.list'), contentId: 'cvList' },
    { name: t('cv.form'), contentId: 'cvForm' },
  ];

  useEffect(() => {
    if (id) {
      fetchData(`cvs/${id}`).then((res) => {
        setTitle(res.data.title);
        setUserId(res.data.userId);
      });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { title, userId };

    const apiCall = id ? updateData(`cvs`, id, data) : createData(`cvs`, data);

    apiCall.then(() => alert(t(id ? 'CV updated successfully!' : 'CV created successfully!'))).catch((err) => console.error(err));
  };

  return (
    <AdminContentLayout dropDefaultContent title={t('admin.CVManagement')} activate={PageName.ADMIN_MANAGE_CV}>
      <TabLayout tabs={HEADERS}>
        {/* Form content */}
        <div id='cvForm'>
          <form onSubmit={handleSubmit}>
            <h3>{t(id ? 'Edit CV' : 'Create CV')}</h3>
            <input type='text' placeholder={t('CV Title')} value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input type='text' placeholder={t('User ID')} value={userId} onChange={(e) => setUserId(e.target.value)} required />
            <button type='submit'>{t(id ? 'Update' : 'Create')}</button>
          </form>
        </div>
      </TabLayout>
    </AdminContentLayout>
  );
};

export default CVForm;
