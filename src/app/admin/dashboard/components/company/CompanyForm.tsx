/** @format */

import React, { FC, useState, useEffect } from 'react';
import AdminContentLayout from '../../../../../common/ui/layout/admin-content-layout';
import TabLayout from '../../../../../common/ui/layout/tab-layout';
import { TabItem } from '../../../../../common/ui/layout/model';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { createData, fetchData, updateData } from '../../api';
import { PageName } from '../../../../../models/enum';

const CompanyForm: FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { id } = useParams<{ id?: string }>();

  const HEADERS: Array<TabItem> = [
    { name: t('company.list'), contentId: 'companyList' },
    { name: t('company.form'), contentId: 'companyForm' },
  ];

  useEffect(() => {
    if (id) {
      fetchData(`companies/${id}`).then((res) => {
        setName(res.data.name);
        setDescription(res.data.description);
      });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name, description };

    const apiCall = id ? updateData(`companies`, id, data) : createData(`companies`, data);

    apiCall.then(() => alert(t(id ? 'Company updated successfully!' : 'Company created successfully!'))).catch((err) => console.error(err));
  };

  return (
    <AdminContentLayout dropDefaultContent title={t('admin.companyManagement')} activate={PageName.ADMIN_MANAGE_COMPANY}>
      <TabLayout tabs={HEADERS}>
        {/* Form content */}
        <div id='companyForm'>
          <form onSubmit={handleSubmit}>
            <h3>{t(id ? 'Edit Company' : 'Create Company')}</h3>
            <input type='text' placeholder={t('Company Name')} value={name} onChange={(e) => setName(e.target.value)} required />
            <textarea placeholder={t('Description')} value={description} onChange={(e) => setDescription(e.target.value)} required />
            <button type='submit'>{t(id ? 'Update' : 'Create')}</button>
          </form>
        </div>
      </TabLayout>
    </AdminContentLayout>
  );
};

export default CompanyForm;
