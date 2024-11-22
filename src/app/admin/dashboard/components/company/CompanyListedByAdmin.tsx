/** @format */

import React, { FC, useState, useEffect } from 'react';
import { deleteCompany, fetchCompaniesByAdmin } from './api';
import { Company } from '../../../../company/model';
import { CTable, CTPaging, CTPageSize, CTRow, BlankFrame, Loading, CButton } from '../../../../../common/ui/base';
import { Confirm, Alert } from '../../../../../common/utils/popup';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-bootstrap';
import TrashIcon from '../../../../../common/ui/assets/ic/20px/trash-bin.svg';
import { useHistory } from 'react-router-dom';
import { PageURL } from '../../../../../models/enum';
import dayjs from 'dayjs';
import { onChange } from 'react-toastify/dist/core/store';

interface Props {
  id: string;
}

const CompanyListedByAdmin: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalData, setTotalData] = useState<number>(0);

  const TABLE_HEADER = [t('field.numeric'), t('field.name'), t('field.address'), t('field.last_updated'), t('field.action')];

  const fetchCompanies = (page: number) => {
    setIsLoading(true);
    fetchCompaniesByAdmin(page, pageSize)
      .then((res) => {
        const { meta, result } = res.data;
        setCompanies(result);
        setCurrentPage(meta.current);
        setTotalPage(meta.pages);
        setTotalData(meta.total);
      })
      .catch(() => Alert.error({ title: t('error.title'), content: t('error.fetchFailed') }))
      .finally(() => setIsLoading(false));
  };

  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
  };

  const handleDelete = (id: string) => {
    Confirm.delete({
      title: t('confirm.deleteTitle'),
      content: t('confirm.deleteContent'),
      onConfirm: () => {
        deleteCompany(id);
        // Add delete API call if available
        // deleteCompanyByAdmin(id)
        //   .then(() => {
        //     Alert.success({ title: t('success.title'), content: t('success.deleted') });
        //     fetchCompanies(currentPage);
        //   })
        //   .catch(() => Alert.error({ title: t('error.title'), content: t('error.deleteFailed') }));
      },
    });
  };

  useEffect(() => {
    fetchCompanies(1); // Initial fetch
  }, [pageSize]);

  return (
    <div>
      <div className='d-flex justify-content-end mb-3'>
        <CButton label={t('btn.admin.addCompany')} onClick={() => history.push(`${PageURL.ADMIN_MANAGE_COMPANY}/create`)} />
      </div>
      <CTable responsive maxHeight={833}>
        <thead>
          <CTRow header data={TABLE_HEADER} />
        </thead>
        <tbody>
          {companies.length > 0 ? (
            companies.map((company, index) => (
              <CTRow
                key={company._id}
                data={[
                  index + 1,
                  company.name || t('field.notSet'),
                  company.address || t('field.notSet'),
                  dayjs(company.updatedAt?.$date).format('YYYY-MM-DD HH:mm:ss') || t('field.notSet'),
                  <Image src={TrashIcon} alt='Delete' className='icon-action ml-3' onClick={() => handleDelete(company._id)} />,
                ]}
                onClick={() => history.push(`${PageURL.ADMIN_MANAGE_COMPANY}/update/${company._id}`)}
              />
            ))
          ) : (
            <BlankFrame className='blank-frame' title={t('field.hint.noData')} />
          )}
        </tbody>
      </CTable>
      {companies.length > 0 && (
        <div className='d-flex justify-content-between mt-5'>
          <div>
            <CTPageSize className='mt-3' onChange={onChangePageSize} totalData={totalData} defaultPageSize={pageSize} />
          </div>
          <div>
            <CTPaging className='mt-4' currentPage={currentPage} totalPage={totalPage} onGetData={fetchCompanies} />
          </div>
        </div>
      )}
      <Loading isOpen={isLoading} />
    </div>
  );
};

export default CompanyListedByAdmin;
