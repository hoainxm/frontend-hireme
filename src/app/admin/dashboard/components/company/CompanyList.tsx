/** @format */

import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchData, deleteData } from './api';
import { Link } from 'react-router-dom';
import style from './company.module.scss';

const CompanyList: FC = () => {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState<Array<{ id: string; name: string; description: string }>>([]);

  useEffect(() => {
    fetchData('companies')
      .then((data) => setCompanies(data))
      .catch((error) => console.error(error));
  }, []);

  const handleDelete = (id: string) => {
    deleteData(`companies`, id)
      .then(() => {
        setCompanies((prevCompanies) => prevCompanies.filter((company) => company.id !== id));
        alert(t('Company deleted successfully!'));
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className={style.list}>
      <h3>{t('Company List')}</h3>
      <table>
        <thead>
          <tr>
            <th>{t('Company Name')}</th>
            <th>{t('Description')}</th>
            <th>{t('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>{company.name}</td>
              <td>{company.description}</td>
              <td>
                <Link to={`/admin/dashboard/company/${company.id}`}>{t('Edit')}</Link>
                <button onClick={() => handleDelete(company.id)}>{t('Delete')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyList;
