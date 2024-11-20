/** @format */

import React, { FC, useState, useEffect } from 'react';
import { fetchCompanies, deleteCompany } from './api';
import { Company } from '../../../../company/model';
import { CTable, CButton, CTPaging, CTPageSize, CTRow, BlankFrame, Loading } from '../../../../../common/ui/base';
import { useTranslation } from 'react-i18next';
import { Confirm, Alert } from '../../../../../common/utils/popup';

interface Props {
  // isSysAdminSite?: boolean;
  id: string;
}

const CompanyListedByAdmin: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalData, setTotalData] = useState<number>(0);

  const fetchData = (page: number) => {
    setIsLoading(true);
    fetchCompanies(page, pageSize)
      .then((res) => {
        setCompanies(res.data.results);
        setCurrentPage(res.data.page);
        setTotalPage(Math.ceil(res.data.total / pageSize));
        setTotalData(res.data.total);
      })
      .catch(() => Alert.error({ title: t('error.title'), content: t('error.fetchFailed') }))
      .finally(() => setIsLoading(false));
  };

  const handleDelete = (id: string) => {
    Confirm.delete({
      title: t('confirm.deleteTitle'),
      content: t('confirm.deleteContent'),
      onConfirm: () => {
        deleteCompany(id)
          .then(() => {
            Alert.success({ title: t('success.title'), content: t('success.deleted') });
            fetchData(currentPage);
          })
          .catch(() => Alert.error({ title: t('error.title'), content: t('error.deleteFailed') }));
      },
    });
  };

  useEffect(() => {
    fetchData(1);
  }, [pageSize]);

  return (
    <>
      <div className='d-flex justify-content-end mb-3'>
        <CButton
          label={t('action.addCompany')}
          onClick={() => {
            /* Redirect to add company form */
          }}
        />
      </div>
      <CTable>
        <thead>
          <CTRow header data={[t('field.name'), t('field.address'), t('field.actions')]} />
        </thead>
        <tbody>
          {companies.length > 0 ? (
            companies.map((company, index) => (
              <CTRow
                key={index}
                data={[company.name, company.address, <button onClick={() => handleDelete(company._id)}>{t('action.delete')}</button>]}
              />
            ))
          ) : (
            <BlankFrame title={t('message.noData')} />
          )}
        </tbody>
      </CTable>
      <div className='d-flex justify-content-between mt-3'>
        <CTPageSize onChange={(e) => setPageSize(Number(e.target.value))} totalData={totalData} />
        <CTPaging currentPage={currentPage} totalPage={totalPage} onGetData={fetchData} />
      </div>
      <Loading isOpen={isLoading} />
    </>
  );
};

export default CompanyListedByAdmin;
