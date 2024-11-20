/** @format */

import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { createData, updateData, fetchData } from './api';
import style from './company.module.scss';

const CompanyForm: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id?: string }>();
  const [formState, setFormState] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (id) {
      fetchData(`companies/${id}`).then((data) => {
        setFormState({
          name: data.name,
          description: data.description,
        });
      });
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const apiCall = id ? updateData(`companies`, id, formState) : createData(`companies`, formState);

    apiCall
      .then(() => {
        alert(t(id ? 'Company updated successfully!' : 'Company created successfully!'));
      })
      .catch((error) => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit} className={style.form}>
      <h3>{t(id ? 'Edit Company' : 'Create Company')}</h3>
      <label>{t('Company Name')}</label>
      <input type='text' name='name' value={formState.name} onChange={handleInputChange} placeholder={t('Enter company name')} required />
      <label>{t('Description')}</label>
      <textarea name='description' value={formState.description} onChange={handleInputChange} placeholder={t('Enter company description')} required />
      <button type='submit'>{t(id ? 'Update' : 'Create')}</button>
    </form>
  );
};

export default CompanyForm;
