/** @format */

import React, { FC, useState, useEffect } from 'react';
import AdminContentLayout from '../../../../../common/ui/layout/admin-content-layout';
import TabLayout from '../../../../../common/ui/layout/tab-layout';
import { TabItem } from '../../../../../common/ui/layout/model';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { createData, fetchData, updateData } from '../../api';
import { PageName } from '../../../../../models/enum';

const UserForm: FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { id } = useParams<{ id?: string }>();

  const HEADERS: Array<TabItem> = [
    { name: t('user.list'), contentId: 'userList' },
    { name: t('user.form'), contentId: 'userForm' },
  ];

  useEffect(() => {
    if (id) {
      fetchData(`users/${id}`).then((res) => {
        setName(res.data.name);
        setEmail(res.data.email);
      });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name, email };

    const apiCall = id ? updateData(`users`, id, data) : createData(`users`, data);

    apiCall.then(() => alert(t(id ? 'User updated successfully!' : 'User created successfully!'))).catch((err) => console.error(err));
  };

  return (
    <AdminContentLayout dropDefaultContent title={t('admin.userManagement')} activate={PageName.ADMIN_MANAGE_USER}>
      <TabLayout tabs={HEADERS}>
        {/* Form content */}
        <div id='userForm'>
          <form onSubmit={handleSubmit}>
            <h3>{t(id ? 'Edit User' : 'Create User')}</h3>
            <input type='text' placeholder={t('User Name')} value={name} onChange={(e) => setName(e.target.value)} required />
            <input type='email' placeholder={t('User Email')} value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type='submit'>{t(id ? 'Update' : 'Create')}</button>
          </form>
        </div>
      </TabLayout>
    </AdminContentLayout>
  );
};

export default UserForm;
